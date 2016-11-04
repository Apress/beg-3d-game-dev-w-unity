// make a Unity array for the three possible states of the object, each will have:
// cursor, new state, other object, its state, another object, its state, etc...
// use ‘default’ for the default cursor name  
var lookupState0 : String[];  //declare an array of string type content 
var lookupState1 : String[];  //declare an array of string type content 
var lookupState2 : String[];  //declare an array of string type content 
var lookupState3 : String[];  //declare an array of string type content 
var lookupState4 : String[];  //declare an array of string type content 
var lookupState5 : String[];  //declare an array of string type content 
var repliesState0 : String[];
var repliesState1 : String[];
var repliesState2 : String[];
var repliesState3 : String[];
var repliesState4 : String[];
var repliesState5 : String[];

var genericReplies : String[]; // Add one reply for each state
var prefabs : GameObject[]; // holder for prefab objects


private var oldNum = -1; // keep the previous random number for the generic replies

// make a regular array of type Array with 3 elements to process the selected element’s contents 
private var stateArray = new Array [6]; 
// make a regular array holding 3 elements to hold the replies for each state 
private var replyArray = new Array [6];

//Gain access to
private var controlCenter : GameObject; //where the GUI is updated

private var matchCursor : String; // the current cursor, "default" is the regular cursor

var state : int; // a variable to hold the element number to process

function Start () {

   controlCenter = gameObject.Find("Control Center"); //find the control center by name

	// load the Unity string arrays into the JavaScript array elements 
	stateArray[0] = lookupState0;
	stateArray[1] = lookupState1;
	stateArray[2] = lookupState2;
	stateArray[3] = lookupState3;
	stateArray[4] = lookupState4;
	stateArray[5] = lookupState5;
	// load the Unity string arrays into the JavaScript array elements
	replyArray[0] = repliesState0;
	replyArray[1] = repliesState1;
	replyArray[2] = repliesState2;
	replyArray[3] = repliesState3;
	replyArray[4] = repliesState4;
	replyArray[5] = repliesState5; 



}


//look up the state of the object to see what needs to happen
function LookUpState (object : GameObject, currentState: int, picker : String) {

	var element : int = 0; // variable to track the element number for a match 

	// check the passed- in cursor texture to see if it is the default cursor rename it if so
	if (picker == controlCenter.GetComponent(GameManager).defaultCursor.name )	matchCursor = "default";
	else matchCursor = picker;
	
	// store the picked object's position on the holder object
	var holder = GameObject.Find("HoldTransform"); // get the holder object


	// store the current object's position on the holder object 
	   holder.transform.position= this.transform.position;
	   holder.transform.rotation= this.transform.rotation;
		if (object.GetComponent(Interactor).dropType == 2)  
		   holder.transform.localScale= Vector3(0,0,0);// flag for skipping rotation on alignment
		else holder.transform.localScale= Vector3(1,1,1); // flag to match rotation 
	

   for(var contents : String in stateArray[currentState]) {

   // split the contents into a temporary array
   var readString : String[] = contents.Split(",".Chars[0]); 


      // if there is a match for the cursor…
      if(readString[0] == matchCursor) {
			//print ("we have a match with cursor: "+ matchCursor + " on " + object.name);
			//send the correct text message off to the GameManager
			var actionMsg : String = replyArray[currentState][element];
			controlCenter.SendMessage("ShowActionMessage", actionMsg);
			//TimeAdjuster(actionMsg); //send the message off to adjust processing time


			  //change the object’s state to the new state by calling its ProcessObject function
			  var nextState : int = parseInt(readString [1]); //convert the string to an integer 
			  if (nextState >= 0) SendMessage("ProcessObject", nextState); // no bypass flag so process it

			//process auxiliary objects if there are any
			var tempLength = (readString.length); //get the length of the current stateArray

			if(tempLength > 2){ // that means there are auxiliary objects
			   for (var x = 2; x < tempLength; x = x + 2) { // go through the rest of the array by 2s

			 //check if the first character is a space, and if so, start the string at the second element
			   var tempS = readString[x];
			   if (tempS.Substring(0,1) == " ") tempS = tempS.Substring(1);
			   
			  var bypass = false; //*************** added this

			//check for special cases here- we will come back to this later
			//check for special tags according to first 3 characters; first is the case, second is optional 
			//info for processing, third is the tag "_"  for special case, example: s0_SomeObjectName
			if (tempS.Substring(2,1) == "_") { // if there is a special case
			   var s = tempS.Substring(0,1);
			   var s2 = parseInt(tempS.Substring(1,1)); // convert the second character to an integer
			   var auxObject = CheckForActive(tempS .Substring(3)); // find the object of that name and activate

			   // look for the matching case
			   
			   switch (s) {
				  case "a":  // trigger animation only on the auxiliary object
					 auxObject.animation.Play(GetComponent(Interactor).animationClip[s2].name);
					 bypass = true; // skip the regular processing
					 break;
				  case "c": // send a message to a script on the auxiliary object to the "DoCamMatch" function
					 object.SendMessage("DoCamMatch"); // gae it its own special case ***********************
					 bypass = true; // skip the regular processing
					 break;
				  case "s": // send a message to a script on the auxiliary object to the "DoTheJob" function
					 auxObject.SendMessage("DoTheJob");
					 if (s2 == 1) bypass = true; // skip the regular processing
					 break;
				  case "b": // change the state on the object only- no animations
					 auxObject.GetComponent(Interactor).currentState= parseInt(readString[x+1]);
					 bypass = true; // skip the regular processing
					 break;
				case "p": // instantiate a prefab
				   // use the s2 number to specify which element of the prefabs array to instantiate
				   Instantiate (prefabs[s2]);
				   bypass = true; // skip the regular processing
				   break;

			   } // close switch
			} // close if
			
			else auxObject = CheckForActive(tempS);

			var newState = parseInt(readString[x+1]);
			
			//print (auxObject.name + " * " + newState + "  " + bypass);
					
			if (newState >= 0 && !bypass) auxObject.SendMessage( "ProcessObject",newState);// -1 is bypass  
			

		} // close the for loop
	   } // close if clause for the auxiliary objects
	
	   // Find any game objects with the DropBox script and call their CheckState function
	   var checker : DropBox[] = FindObjectsOfType(DropBox) as DropBox[];
	   for (var box : DropBox in checker){
		   box.CheckState();
	   }
	
		return; // found and processed a match, so leave *******************

    } // close there is a match
	 
	 controlCenter.GetComponent(GameManager).showPointer = true;
		
	 element ++; //increment the element counter by 1

   } // end for loop
   

	// The current cursor, passed in as "picker", was not a match with an inventory object, so did not provoke any reaction- show a reply
	if (gameObject.tag != "InventoryObject") HandleNoMatchReplies(picker); 


	else if (matchCursor != "default"){  //swap out the cursor with the object it picked

		 //change the picked object's state to 10,
		GetComponent(Interactor).currentState = 10;
		//change the cursor object's state to 11
		GameObject.Find(picker).GetComponent(Interactor).currentState = 11;
		//store this object's current inventory element number on the GameManager
		controlCenter.GetComponent(GameManager).replaceElement = GetComponent(Interactor).iElement; 

	   //put the old cursor in inventory
	   GameObject.Find(picker).SendMessage("ProcessObject",1);

	   //pick up the new cursor
	   SendMessage("ProcessObject",2);
	   
	   HandleCursorSwapReplies (picker); // build a reply for the swapped cursor 
	} 

	//process non- default cursors that found no match
	// get the cursor texture name and put the cursor object back into inventory
	if(matchCursor != "default")gameObject.Find(picker).SendMessage("ProcessObject",1);

	//turn on the pointer again
	controlCenter.GetComponent(GameManager).showPointer = true;


	//turn off the processing flag so the object can be interactive again
	this.GetComponent(Interactor).processing = false;


}


/* // function to calculate extra processining time to read action message
 * function TimeAdjuster(actionMsg : String) {
 * 
 * 	var stringLength: int  =  actionMsg.length;
 *     var addTime = stringLength / 20.0 -1.5; //calculate the amount of time to add
 *     if (addTime >= 0) GetComponent("Interactor").timeLimit2 = GetComponent("Interactor").timeLimit2 + addTime;
 * 
 * }
 */

function HandleNoMatchReplies (picker : String) {
	   picker = picker.ToLower(); // make it lower case
	   picker = picker.Substring(0,picker.length - 5); // strip off the icon part of the name
	   var tempObjectName = this.GetComponent("Interactor").currentObjectName.ToLower();
	   if (genericReplies.length ==0) {
		   //the object has no generic replies, so get the game generic replies, depending on cursor
		   if (matchCursor == "default") var tempMsg = controlCenter.GetComponent(MiscText).ReallyRandomReply();
		   else tempMsg = controlCenter.GetComponent(MiscText).RandomReply();
	   }
	    else {  // there was at least one generic reply
		if (genericReplies.length >1) {
		   var num = Random.Range(0,genericReplies.length);// get a random number
		   while (num == oldNum) num = Random.Range(0,genericReplies.length);
		   oldNum = num; // store the new random number for next time
		   tempMsg= genericReplies[num]; // assign the winner
		}

	        else tempMsg = genericReplies[0]; // there was only one
	   } //close first else
	   
		// add a blank character to the end of the string in case the last character is a split
		tempMsg = tempMsg + " ";
		// split contents into a temp array
		var readString : String[] = tempMsg.Split("@".Chars[0]); 

		if(readString.length > 1) // if there was a "@" in the string
		   //rebuild the reply using the object short name at the @
		   tempMsg = readString[0] + tempObjectName + readString[1];

		// split contents into a temp array
		readString = tempMsg.Split("^".Chars[0]); 

		if(readString.length > 1) // if there was a "^" in the string
		   //rebuild the reply using the cursor name at the ^
		   tempMsg = readString[0] + picker + readString[1];
			   

	   //send the GameManager the action text
	   controlCenter.GetComponent(GameManager).actionMsg=tempMsg;
	   //tell the GameManager to show the action text
	   controlCenter.GetComponent(GameManager).showActionMsg=true;
	   //wait two seconds then turn off the action text and leave the function
	   yield new WaitForSeconds(2.0);
	   controlCenter.GetComponent(GameManager).showActionMsg= false;
	   return;
	}


function HandleCursorSwapReplies (picker : String) {
	   picker = picker.ToLower(); // make it lower case
	   picker = picker.Substring(0,picker.length - 5); // strip off the icon part of the name
	   var tempObjectName = this.GetComponent("Interactor").currentObjectName.ToLower();
	   var tempMsg = "You exchange the " + picker + " for the " + tempObjectName ;  
	   //send the GameManager the action text
	   controlCenter.GetComponent(GameManager).actionMsg=tempMsg;
	   //tell the GameManager to show the action text
	   controlCenter.GetComponent(GameManager).showActionMsg=true;
	   //wait two seconds then turn off the action text and leave the function
	   yield new WaitForSeconds(2.0);
	   controlCenter.GetComponent(GameManager).showActionMsg= false;
	   return;
	}


function CheckForActive(tempS : String) {
   // check to see if the object is active before assigning it to auxObject
   if(gameObject.Find(tempS)) var auxObject = gameObject.Find(tempS);
   else {
      var actionObjects = controlCenter.GetComponent(GameManager).actionObjects;
      for (var y =0; y < actionObjects.length; y++) { // itterate through the array
         if (actionObjects[y].name == tempS) {  // if there is a match for the name
            actionObjects[y].active = true; // activate the matched object from the array
            auxObject = gameObject.Find(tempS); // assign the newly activated object
			//update the fx volume
			auxObject.GetComponent(Interactor).soundFXVolume = controlCenter.GetComponent(GameManager).soundFXVolume;
        }
      }
   }
   return auxObject;

} // close CheckForActive() function











