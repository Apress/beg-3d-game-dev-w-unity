var offeringIcon : GameObject; // this will be the Jewel Icon

var weapons : GameObject[];
var weaponsIcons : GameObject[];
var weaponsNewState : int[]; // state the object goes to when found

var controlCenter : GameObject; // where the current cursor texture can be found
var reply : String[]; // temp way to check the replies quickly before adding the audio
var audioReply : AudioClip[]; // reply according to action needed
private var templeState : int; // 0, no entry, 1 can enter, 2, passage open
private var response : int; // array element for response

var dropPoint : Transform; // the place weapons get located to


//response codes:
//0- no cursor, needs offering in hand
//1- has offering, but not accepted
//2- offering accepted, entry granted
//3- offering accepted, entry granted, weapons relocated
//4-weapons relocated
//5- no response

function OnTriggerEnter () {

response = 5; // no response

   //get access to the cursor to see if player is holding anything
   var cursorName = controlCenter.GetComponent(GameManager).currentCursor.name; 
   var defaultCursor = controlCenter.GetComponent(GameManager).defaultCursor.name;
   var empty = true; // clear cursor flag
   if (cursorName != defaultCursor) empty = false; // holding something- need to check
   // see if there are currently any items in inventory
   var iCount : int =  (controlCenter.GetComponent(GameManager).currentInventoryObjects.length);
   // load the current inventory objects if there are any – they will need to be check for weapons
   if (iCount > 0) var iObjects = controlCenter.GetComponent(GameManager).currentInventoryObjects;

	//Check for the jewel
	if (templeState == 0 ) { //no admittance yet, so first look for offering
	   response =0; // assume no offering
	   // check cursor 
	   if (cursorName == offeringIcon.name) {
		  ProcessOffering(); 
		  response = 2; // player has correct offering
	   }
	  else if (cursorName != defaultCursor)  response = 1; // wrong offering


	   if (response < 2) { // no admittance
		  HandleReply();
		  return;
	   }

	}
	
	// player has access so strip out weapons 

	   // see if cursor is a weapon
	   for (i = 0; i  < weaponsIcons.length; i++) {
		  if (weaponsIcons[i].name == cursorName) { // a match was found
			 ProcessWeapons(i); 
			 response = 4; 
		  }
	   }

   //check current inventory (if any) items against weapons list
   if (iCount > 0) { 
      for (i = 0; i  < weaponsIcons.length; i++) { // check the list 
         //update the inventory count in case you just removed one on the last pass
          iCount = (controlCenter.GetComponent(GameManager).currentInventoryObjects.length);
         for (var  k = 0; k < iCount; k++) { // with the contents  
            if (weaponsIcons[i] == iObjects[k]) {// looking for a match
              ProcessWeapons(i); // got one, send it off to be processed
              k = iCount; //force end of loop so we don't get an error changing iCount
              if (response == 2) response = 3;
              else response = 4;
           }
        }
     }
  }

   HandleReply ();

}

function ProcessOffering () {

   // take icon out of inventory
   gameObject.Find(offeringIcon.name).SendMessage("ProcessObject",0);
   templeState = 1; // upgrade temple state
   gameObject.Find("Temple Blocker").active = false; //disable the blocker 
   gameObject.Find("FX Range").SendMessage("KillEffect");
   yield new WaitForSeconds(6); // wait for the particles to fade
   gameObject.Find("FX Range").active = false; //disable the fx checker
}


function ProcessWeapons (index : int) {

   // take icon out of inventory or cursor
   gameObject.Find(weaponsIcons[index].name).SendMessage("ProcessObject",0);

   // find, activate and process mesh object into scene
   var actionObjects = controlCenter.GetComponent(GameManager).actionObjects;
   for (var y =0; y < actionObjects.length; y++) { // iterate through the array
      if (actionObjects[y].name == weapons[index].name) {  // if there is a match for the object
         actionObjects[y].active = true; // activate the matched object from the array
         actionObjects[y].SendMessage("ProcessObject",weaponsNewState[index]);
      }
   }

   //un-parent the object, then move weapon to new location 
   //if the object has a parent, remove it from the parent first
   if (weapons[index].transform.IsChildOf(weapons[index].transform))
      weapons[index].transform.parent = null; // detach from parent
	gameObject.Find("MazeWalls").SendMessage("FindDropPoint",weapons[index]);

}

function HandleReply () {

   if (response == 5) return;
   print (reply[response]); // this is temporaary until we load the audio files
  audio.PlayOneShot(audioReply[response]);

}

function UpdateStateVar () {

   //send the object's state value to the GenericStateTracker script
   GetComponent(GenericStateTracker).state = templeState;

}

function LoadState (newState : int) {

	templeState = newState; // update the temple state
	
   if(newState > 0) {
      gameObject.Find("TempleBlocker").active = false; //disable the blocker 
      gameObject.Find("FX Range").SendMessage("KillEffect");
      gameObject.Find("FX Range").active = false; //disable the fx checker
   }
   else return; 
}












