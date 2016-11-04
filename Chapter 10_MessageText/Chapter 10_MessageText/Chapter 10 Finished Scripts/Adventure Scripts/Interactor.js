var initialState : int = 0; // in case you need other than state 0
private var currentState : int = 0; // this will get updated in Start 

//Object metadata
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




// Pick and Mouseover Info
var triggerDistance : float = 7.0; // distance the camera must be to the object before mouse over
var moOffset : float = 10.0;  // additional distance to allow mouseover to be seen
private var picked = false;  // so we can temporarily prevent mouseover action 
private var mousedown : boolean; // so we know when this is true
private var processing = false; //so we can suspend mouseover actions, etc


// Gain access to these objects 
var gamePointer : GameObject;  
private var cam : GameObject;
private var controlCenter : GameObject;
var aniObject : GameObject; // for use when the animation is on the parent 

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
	
	originalMaterial = GetComponent(MeshRenderer).material; // load the material into var
	if (originalMaterial.mainTexture) { // if a texture exists, do…
	   useTexture = true;
	   aoTexture =  originalMaterial.mainTexture;
	   //print (name + ":  "  + aoTexture.name);
	}
	else useTexture = false;
	
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

	// if navigating [is true], exit the function now
	if (controlCenter.GetComponent(GameManager).navigating) return;

	//print (DistanceFromCamera());

	if (DistanceFromCamera() > triggerDistance + moOffset) return;

	if (useMOCursorChange) gamePointer.SendMessage("CursorColorChange", true); // turn the pointer back to white 


	//activate the text visibility on mouseover
	controlCenter.GetComponent(GameManager).showText = true;

	//send the correct text to the GameManager for display
	controlCenter.GetComponent(GameManager).shortDesc= currentObjectName ;
	controlCenter.GetComponent(GameManager).longDesc = currentObjectDescription;
	// automatic bypass flag
	if(DistanceFromCamera() <= triggerDistance) {
		controlCenter.GetComponent(GameManager).inRange =true;}
	else  controlCenter.GetComponent(GameManager).inRange =false;




if (useMOMaterialChange) {
	
	   if (overrideMaterial) mouseOverMaterial = overrideMaterial;

	   else {
	   
		  if (useTexture) mouseOverMaterial.mainTexture = aoTexture;

		  else mouseOverMaterial.mainTexture = null;
	   
	   }

		renderer.material = mouseOverMaterial; // swap the material
	}
}


function OnMouseExit () {

	//deactivate the text visibility on mouseover
	controlCenter.GetComponent(GameManager).showText = false;


    if (useMOCursorChange) gamePointer.SendMessage("CursorColorChange", false); // turn the pointer white
	renderer.material = originalMaterial;

}



function OnMouseDown () {

	// exit if we are not within range 
	if (DistanceFromCamera() > triggerDistance + moOffset) return;
	
	// if the player is within mouseover but not picking distance...
	if (DistanceFromCamera()  > triggerDistance ) {
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
	// turn the object back to original if it is being used
	if(useMOMaterialChange) renderer.material = originalMaterial;  

	// *** send a message turn the cursor color back to original if it is being used
	if(useMOCursorChange) { 
	   gamePointer.GetComponent(CustomCursor).SendMessage("CursorColorChange",false);  
	}
	
	//deactivate the text messages
	controlCenter.GetComponent(GameManager).showText = false;
   // start a timer to turn processing 
   //tell the GameManager which object just started the timer2
   controlCenter.GetComponent(GameManager).actionObject  = this.name;
   timeLimit2 = Time.time + 2.0;
   timer2 = true;
	


	//send the picked object, its current state, and the cursor [texture] that picked it
	// to the LookUpState function for processing
	GetComponent(ObjectLookup).LookUpState(this.gameObject, currentState, gamePointer.GetComponent(CustomCursor).currentCursor.name);



}



function DistanceFromCamera () {

   // get the direction the camera is heading so you only process stuff in the line of sight
   var heading : Vector3 = transform.position - cam.transform.position;
   //calculate the distance from the camera to the object 
   var distance : float = Vector3.Dot(heading, cam.transform.forward);
   return distance;
}


 function ProcessObject (newState : int) {
   
   currentState = newState; // update the state
   
   //load new states’ metadata
   currentObjectName = objectName[currentState];
   currentObjectDescription = description[currentState];
   
   //tell the GameManager to show the action text
	controlCenter.GetComponent(GameManager).showActionMsg=true;


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

} // close ProcessObject function



