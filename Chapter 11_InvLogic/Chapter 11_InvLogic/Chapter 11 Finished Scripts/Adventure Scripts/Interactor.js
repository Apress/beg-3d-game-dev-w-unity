var initialState : int = 0; // in case you need other than state 0
private var currentState : int = 0; // this will get updated in Start 

//Object metadata
var objectIs3D = true; //flag to identify GUI Texture objects
var location : int[];	 // see notes
var visbilityType : int[];   // see notes
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
       if (controlCenter.GetComponent(GameManager).actionObject  == this.name) {
          //tell the GameManager to hide the action text
          controlCenter.GetComponent(GameManager).showActionMsg=false;
      }
     timer2 = false;
	 //print ("time's up");
	 controlCenter.GetComponent(GameManager).ResetMouseOver(); 
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

	if (iMode  && gameObject.layer != 9) return;

	// exit if we are not within range 
	if (DistanceFromCamera() > triggerDistance + moOffset&& !iMode ) return;
	
	// if the player is within mouseover but not picking distance...
	if (DistanceFromCamera()  > triggerDistance && !iMode ) {
	   var tempMsg : String = "You are too far from the " + objectName[currentState].ToLower() + " to interact with it";
	   //send the GameManager the action text
	   controlCenter.GetComponent(GameManager).actionMsg = tempMsg;	
	   //tell the GameManager to show the action text
	   controlCenter.GetComponent(GameManager).showActionMsg = true;
	   //wait two seconds then turn off the action text and then leave the function
	   yield new WaitForSeconds(2.0);
	   controlCenter.GetComponent(GameManager).showActionMsg = false;
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
   // start a timer to turn processing 
   //tell the GameManager which object just started the timer2
   controlCenter.GetComponent(GameManager).actionObject  = this.name;
   timeLimit2 = Time.time + 2.0;
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
   
   previousState = currentState; // store the previous state before updating
   currentState = newState; // update the state
   
   //load new states’ metadata
   currentObjectName = objectName[currentState];
   currentObjectDescription = description[currentState];
   currentLocation = location[currentState];
   
   //tell the GameManager to show the action text
	controlCenter.GetComponent(GameManager).showActionMsg=true;

	if(!objectIs3D) Handle2D(); // send 2D objects off for processing
	
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

   if(animates) {
      // assign the current clip and delay for the new state
      currentAnimationClip = animationClip[currentState];
      currentAnimationDelay = animationDelay[currentState];
      //pause before playing the animation if required
      yield new WaitForSeconds(currentAnimationDelay);
      if (aniObject != null) { // if there is an animation- it is not null,
          aniObject.animation.Play(currentAnimationClip.name);
          aniLength = currentAnimationClip.length;// get its length
         
         // wait the length of the animation, then play looped animation if there was one
         yield new WaitForSeconds(aniLength); 
         if (postLoop) aniObject.animation.Play(loopAnimation[currentState].name);  
      } 
   } // close if(animates) 
   
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
}


