var initialState : int = 0; // in case you need other than state 0
var currentState : int = 0; // this will get updated in Start 

//Object metadata
var objectIs3D = true; //flag to identify GUI Texture objects
var location : int[];	 // see notes
var visibilityType : int[];   // see notes
var objectName : String[];  // name/label of the object in this state 
var description : String[];  // description of the object in this state
var animationClip : AnimationClip[]; 	// the animation that will play when picked
var animationDelay : float[];	// the time delay before the animation plays
var soundClip : AudioClip[]; 	// the sound that gets played when picked
var audioDelay : float[];    //the time delay before the sound gets played
var loopAnimation : AnimationClip[]; //animation that loops after main animation
var loopSoundFX : AudioClip[]; // sound that goes with it
var postLoop : boolean = false;  // flag to know if it has a looping animation to follow
var animates : boolean = true; // var to know if it animates at all
var transformTo : GameObject[];  // move to another object's transforms array
var dropType : int = 0; // 0 is not dropable, 1 is dropable , 2 is a drop location


private var iMode : boolean;


// Pick and Mouseover Info
var triggerDistance : float = 7.0; // distance the camera must be to the object before mouse over
var moOffset : float = 10.0;  // additional distance to allow mouseover to be seen
private var picked = false;  // so we can temporarily prevent mouseover action 
private var mousedown : boolean; // so we know when this is true
private var processing = false; //so we can suspend mouseover actions, etc


// Gain access to these objects 
private var cam : GameObject;
private var controlCenter : GameObject;
var aniObject : GameObject; // for use when the animation is on the parent 
private var mouseOverColor : Color; 
private var useIconColorChange = true;
private var iElement = 0; // will hold the object's element in inventory number  
var useAlpha = true; // flag to fade material during visibility change
private var fadeIn = false; // flags to control opacity in Update
var fadeOut = false;
private var fadeTime = 0.5; //default time over which the fades happen

private var maxAlpha : float; // maximum alpha value the material can have


//state dependent variables
private var currentLocation : int;  // see notes
private var currentVisibility : int; //see notes 
private var currentObjectName : String; // short description
private var currentObjectDescription : String; // full description
private var currentSound : AudioClip;
private var currentAudioDelay : float = 0.0;
private var currentAnimationClip : AnimationClip;
private var currentAnimationDelay : float = 0.0;
private var currentAniLength : float;  // get length to calculate delays
private var currentLoopAnimation : AnimationClip;
private var currentLoopSound : AudioClip;
private var previousState :int; 
private var element = 0; // element number when in inventory



//Misc vars
private var originalMaterial : Material;
private var aoTexture : Texture;
private var mouseOverMaterial : Material;
private var useTexture : boolean;
var overrideMaterial : Material;
private var useMOCursorChange : boolean;
private var useMOMaterialChange : boolean;
private var soundFXVolume : float; // we will get this from GameManager

//Timer variables
private var timer1 : boolean = false; // timer 1 on or off, it is off by default
private var timeLimit1 : float; // amount of time the timer runs for
private var timer2 : boolean = false; // timer 2 on or off
private var timeLimit2 : float; // amount of time the timer runs for


function Start () {

	// search the scene for an object named “main Camera” and assign it to the variable cam
	cam = GameObject.Find("Main Camera");
	
	controlCenter = GameObject.Find("Control Center");
	mouseOverMaterial = controlCenter.GetComponent(GameManager).mouseOverMaterial;
	soundFXVolume= controlCenter.GetComponent(GameManager).soundFXVolume;
	mouseOverColor = controlCenter.GetComponent(GameManager).mouseOverColor;
	useIconColorChange = controlCenter.GetComponent(GameManager). useIconColorChange;
	
	//prep for mouse over material change if it is a regular 3D object
    if(objectIs3D) { // do the following
		originalMaterial = GetComponent(MeshRenderer).material; // load the material into var
		maxAlpha = originalMaterial.color.a;// store the alpha value of the original material
		// prep for auto fade of 3D objects unless specified as false
		if (useAlpha) { // if it isn't set to false by the author
		   useAlpha = false; // set it to false, there will be only one condition to make it true
		   var tempShadername = renderer.material.shader.name; // get the shader name
		   if (tempShadername.length > 11) { //check for short names- they aren't transparents
			  if(tempShadername.Substring (0,11) == "Transparent") useAlpha = true;// set the flag to uses alpha
		  }
		}
		if (originalMaterial.mainTexture) { // if a texture exists, do…
		   useTexture = true;
		   aoTexture =  originalMaterial.mainTexture;
		   //print (name + ":  "  + aoTexture.name);
		}
		else useTexture = false;
	}
	
	useMOCursorChange = controlCenter.GetComponent(GameManager).useMOCursorChange;

	useMOMaterialChange = controlCenter.GetComponent(GameManager).useMOMaterialChange;

	// find out if a parent animator object was assigned, if not, assign the object itself
	if (aniObject == null) aniObject = gameObject;
	
	// load the initial values 
	currentState = initialState; // this allows override of starting state only
	currentObjectName = objectName[currentState];
	currentObjectDescription = description[currentState];  
    currentLocation = location[currentState];
    currentVisibility = visibilityType[currentState];

	
	//turn off visibility for inventory icons that are not yet in the scene
	if (currentState == 0 && !objectIs3D) guiTexture.enabled = false; 
	
	// if the object's location is not in scene, 4, deactivate it after setting its opacity to 0
	if (currentLocation == 4) {
	   if (useAlpha == true) renderer.material.color.a = 0; // prep for fade in
	   gameObject.active = false;
	}
	

}


function Update () {
   //timer1
   if(timer1 && Time.time > timeLimit1) {
      AudioSource.PlayClipAtPoint(currentSound,transform.position,soundFXVolume);
      timer1 = false; // turn off the timer
   }
   
   // timer 2- animation processing delay
   if(timer2 && Time.time > timeLimit2){
     processing = false;
	 controlCenter.GetComponent(GameManager).showPointer = true;
	 //tell the GameManager to hide the action text
       //~ if (controlCenter.GetComponent(GameManager).actionObject  == this.name) {
          //~ //tell the GameManager to hide the action text
          //~ controlCenter.GetComponent(GameManager).showActionMsg=false;
      //~ }
     timer2 = false;
	 //print ("time's up");
	 controlCenter.GetComponent(GameManager).ResetMouseOver(); 
   }
   
   if(fadeIn) {
      // if the alpha is less than the maxAlpha amount,
      if(renderer.material.color.a < maxAlpha) 
         renderer.material.color.a += Time.deltaTime/ fadeTime;// increase the alpha
      // else it is finished , so stop increasing the alpha value
      else fadeIn = false;
  }
   if(fadeOut) {
      // if the alpha is greater than 0,
      if(renderer.material.color.a > 0.0) 
         renderer.material.color.a -= Time.deltaTime/ fadeTime;// decrease the alpha
      // else it is finished , so stop decreasing the alpha value
      else fadeOut = false;
  }
   
}





function OnMouseEnter () {

	if(currentLocation == 3) return; // object is no longer active in scene
	
	if (processing) return; // leave the function
	
	iMode = controlCenter.GetComponent(GameManager).iMode; // get current iMode
	if (iMode  && gameObject.layer != 9) return; // return if the mo was not over an inventory object and we are in inventory mode


	// if navigating [is true], exit the function now
	if (controlCenter.GetComponent(GameManager).navigating) return;

	//print (DistanceFromCamera());

	if (DistanceFromCamera() > triggerDistance + moOffset && !iMode ) return;

	controlCenter.GetComponent(GameManager).showMOCursorChange = true; // colorize the pointer



	//activate the text visibility on mouseover
	controlCenter.GetComponent(GameManager).showText = true;

	//send the correct text to the GameManager for display
	controlCenter.GetComponent(GameManager).shortDesc= currentObjectName ;
	controlCenter.GetComponent(GameManager).longDesc = currentObjectDescription;
	
	// automatic bypass flag
	if(!objectIs3D) controlCenter.GetComponent(GameManager).inRange =true;
	else {
		if(DistanceFromCamera() <= triggerDistance) {
			controlCenter.GetComponent(GameManager).inRange =true;}
		else  controlCenter.GetComponent(GameManager).inRange =false;
	}



	//handle mouseover color changes
	if (useMOMaterialChange) { 
	   if (objectIs3D) {
		  //activate the material change
		  if (overrideMaterial) renderer.material = overrideMaterial;
		  else {
			 mouseOverMaterial.mainTexture = aoTexture;
			 renderer.material = mouseOverMaterial;
		 }
	   }
	}
   // do the color change for 2D GUI objects if it is being used
   if (useIconColorChange  && !objectIs3D)guiTexture.color = Color(0.75, 0.75, 0.75,1); 

}


function OnMouseExit () {

	//deactivate the text visibility on mouseover
	controlCenter.GetComponent(GameManager).showText = false;

	controlCenter.GetComponent(GameManager).showMOCursorChange = false; // return the pointer to default color
	
	// return the 3D object's material to the original
	if(useMOMaterialChange && objectIs3D) renderer.material = originalMaterial;

	// return the 2D object's color to the original
	 if (useIconColorChange  && !objectIs3D)guiTexture.color = Color.grey;

	
   yield new WaitForSeconds (0.5);
   controlCenter.GetComponent(GameManager).showPointer = true;


}



function OnMouseDown () {

	if(currentLocation == 3) return; // object is no longer active in scene

	if (processing) return; // leave the function

	// allow picks from layers 8 and 9 in Inventory mode
	if (iMode  && gameObject.layer < 8) return; 

	//store the distance from camera in a variable 
	var tempDistance: float  = DistanceFromCamera();

	//override the distance check if the object is in layer 8
	if(gameObject.layer == 8) tempDistance = 1;

	// exit if we are not within range 
	if (tempDistance > triggerDistance + moOffset&& !iMode ) return;
	
	// if the player is within mouseover but not picking distance...
	if (tempDistance  > triggerDistance && !iMode ) {
	   var tempMsg : String = "You are too far from the " + objectName[currentState].ToLower() + " to interact with it";
		//send the GameManager the action text for processing
		controlCenter.SendMessage("ShowActionMessage", tempMsg);
		return;

	}

	

	//print ("we have mouse down on " + this.name); 
	// return the object's material or color to the original
	if(useMOMaterialChange) {
	   if (objectIs3D) renderer.material = originalMaterial;
	   else guiTexture.color = Color.grey;
	} 


	controlCenter.GetComponent(GameManager).showMOCursorChange = false; // return the  pointer to default color

	
	//deactivate the text messages
	controlCenter.GetComponent(GameManager).showText = false;
   // adjust processing time according to object 
   if (objectIs3D) var processTime : float = 1.5;  // ************  added this bit
   else processTime = 0.5; // it was an inventory object- needs less time
     // start a timer to turn processing 
   timeLimit2 = Time.time + processTime;
   timer2 = true;
	
	// hide the cursor while processing the pick
	controlCenter.GetComponent(GameManager).showPointer = false;


	//send the picked object, its current state, and the cursor [texture] that picked it
	// to the LookUpState function for processing
	GetComponent(ObjectLookup).LookUpState(this.gameObject,currentState,controlCenter.GetComponent(GameManager).currentCursor.name );



}



function DistanceFromCamera () {

   // get the direction the camera is heading so you only process stuff in the line of sight
   var heading : Vector3 = transform.position - cam.transform.position;
   //calculate the distance from the camera to the object 
   var distance : float = Vector3.Dot(heading, cam.transform.forward);
   return distance;
}


 function ProcessObject (newState : int) {
 
   processing = true;
   
   //handle replace
	if(newState == 10) {
	   newState = 1;
	   currentState = 10;
	}
	 if (newState == 11) {
	   newState = 2;
	   currentState = 11; 
	} 

   
   previousState = currentState; // store the previous state before updating
   currentState = newState; // update the state
   
   //load new states’ metadata
   currentObjectName = objectName[currentState];
   currentObjectDescription = description[currentState];
   currentLocation = location[currentState];
   currentVisibility = visibilityType[currentState];
   
	if (dropType == 1) {

		var holder = GameObject.Find("HoldTransform"); // get the holder object

	   // if there are any elements in the array
	   if (transformTo.length > 0 && transformTo[currentState] != null) {
		  print ("moving to " + transformTo[currentState].name);
		  holder.transform.position= transformTo [currentState].transform.position;
		  holder.transform.rotation= transformTo [currentState].transform.rotation;
	   }
	   transform.position = holder.transform.position;
	   transform.rotation = holder.transform.rotation;
	}

   
   //~ //tell the GameManager to show the action text
	//~ controlCenter.GetComponent(GameManager).showActionMsg=true;

	if(!objectIs3D) Handle2D(); // send 2D objects off for processing
	// else it is 3d- send it off for handling in case it has a visibility state that is processed at the start
	else if (currentLocation == 0)  HandleVisibility(); 

	
   // process audio  
   currentSound = soundClip[currentState];
   currentAudioDelay = audioDelay [currentState];
   //create an audio source and play a sound if there is one, at the location of the
   //picked object, the audio source is deleted after playing
   if(currentSound)  { // if there is a sound,  
      if (currentAudioDelay == 0) // if no delay, go ahead and play it
         AudioSource.PlayClipAtPoint(currentSound,transform.position,soundFXVolume);
      else { // else set up a timer to play after the delay
          timeLimit1= Time.time + currentAudioDelay; // add the delay to the current time
          timer1 = true; // start the timer (in Update function)
       }
   }

   if(animates && animationClip[currentState] != null) {
      // assign the current clip and delay for the new state
      currentAnimationClip = animationClip[currentState];
      currentAnimationDelay = animationDelay[currentState];
      //pause before playing the animation if required
      yield new WaitForSeconds(currentAnimationDelay);
      if (aniObject != null) { // if there is an animation- it is not null,
          aniObject.animation.Play(currentAnimationClip.name);
          aniLength = currentAnimationClip.length;// get its length
          yield new WaitForSeconds(aniLength * 2/3);
		  if (currentVisibility > 2) {
		     if (currentVisibility == 3) currentVisibility =4;// if we're here, the start has been done
		     HandleVisibility( ); 
		  }
         // wait the length of the animation, then play looped animation if there was one
         yield new WaitForSeconds(aniLength * 1/3); 
         if (postLoop) animation.Play(loopAnimation[currentState].name);  
      } 
   } // close if(animates) 
  //if it doesn't animate, show the pointer again after a brief pause
	else { 
	   yield new WaitForSeconds(0.25);
	   controlCenter.GetComponent(GameManager).showPointer = true;
	}
	 
   if(currentLocation == 4) HandleVisibility(); // goes out of scene
   
   // if the object was activated by another object (no was timer started)
   if(timer2 == false) processing = false;

} // close ProcessObject function

//handle 2D objects
function Handle2D () {
   
   // Not in scene -> Is Cursor
   if (previousState == 0 && currentState == 2) {

      controlCenter.GetComponent(GameManager).currentCursor = guiTexture.texture;
  }

   // Not in scene -> In Inventory
   if (previousState == 0 && currentState == 1) {
      controlCenter.SendMessage("AddToInventory", gameObject);
      gameObject.guiTexture.enabled = true;
  }

   // Is Cursor -> Not in scene
   if (previousState == 2 && currentState == 0) {
      controlCenter.SendMessage("ResetCursor");   
  }
   // Is Cursor -> In Inventory
   if (previousState == 2 && currentState == 1) {
      controlCenter.SendMessage("AddToInventory", gameObject);
      gameObject.guiTexture.enabled = true;
      controlCenter.SendMessage("ResetCursor");
  }
   // In Inventory -> Not in scene
   if (previousState == 1 && currentState == 0) {
      gameObject.guiTexture.enabled = false;
      controlCenter.SendMessage("RemoveFromInventory", gameObject);
  }

   // In Inventory -> Is Cursor
   if (previousState == 1 && currentState == 2) {
      gameObject.guiTexture.enabled = false;
      controlCenter.SendMessage("RemoveFromInventory", gameObject);
      controlCenter.GetComponent(GameManager).currentCursor = guiTexture.texture;
  }
  
	 // In Inventory, will be replaced 
	if (previousState == 10) { 
	   //turn off the object
	   gameObject.guiTexture.enabled = false;
	   //turn it into the cursor
	   controlCenter.GetComponent(GameManager).currentCursor = guiTexture.texture;
	} 
 
	//the new object that takes the picked object's position
	if (previousState == 11) { 
	   controlCenter.SendMessage("ResetCursor");  
	   //set its state to inventory
	   currentState = 1;
	   gameObject.guiTexture.enabled = true;
	   //get the element number in inventory that it replaces
	   iElement = controlCenter.GetComponent(GameManager).replaceElement;
	   //insert the new object to inventory at the correct element position
	   controlCenter.GetComponent(GameManager).currentInventoryObjects[iElement] = this.gameObject; 
	   //update the inventory grid 
	   controlCenter.GetComponent(GameManager).InventoryGrid();
	} 
    yield new WaitForSeconds(20); 
  
}

//handle the various Visibility conditions:
function HandleVisibility() {

	 // adjust the fade time for the ani length if there is a clip for this state
	 if(animates && currentAnimationClip != null) 
		 fadeTime = fadeTime = currentAnimationClip.length * 1/3;
	  else fadeTime = 0.5; //set it back to default
	  if (!useAlpha && !animates) fadeTime = 0.0; // set it to 0 if the object doesn't fade    

    switch (currentVisibility) {

	  case 0 : // no fades 
		  if(currentLocation == 4 ) gameObject.active = false; // deactivate the object
		  break;

	  case 1: // currentVisibility  is 1 show 
		   if (useAlpha) fadeIn = true;
		   break;

	  case 2 :  // currentVisibility is 2 hide 
		  if (useAlpha) fadeOut = true; // start fade out if it gets used
		  yield new WaitForSeconds(fadeTime); // allow fade time
		  gameObject.active = false; // deactivate the object
		  break;

	  case 3: // currentVisibility  3 show 
		   if (useAlpha) fadeIn = true;
		   break;

	  case 4 :  // currentLocation is 4 hide 
		  if (useAlpha) fadeOut = true; // start fade out if it gets used
		  yield new WaitForSeconds(fadeTime); // allow fade time before deactivating
		  gameObject.active = false; // deactivate the object
		  break;

    }


}

