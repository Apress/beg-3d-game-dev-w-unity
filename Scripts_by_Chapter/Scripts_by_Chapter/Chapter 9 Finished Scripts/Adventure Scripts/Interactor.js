
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

//state dependent variables
var initialState : int = 0; // in case you need other than state 0
private var currentState : int = 0; // this will get updated in Start
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


function Start () {

	// search the scene for an object named “main Camera” and assign it to the variable cam
	cam = GameObject.Find("Main Camera");
	
	controlCenter = GameObject.Find("Control Center");
	mouseOverMaterial = controlCenter.GetComponent(GameManager).mouseOverMaterial;

	
	originalMaterial = GetComponent(MeshRenderer).material; // load the material into var
	if (originalMaterial.mainTexture) { // if a texture exists, do…
	   useTexture = true;
	   aoTexture =  originalMaterial.mainTexture;
	   //print (name + ":  "  + aoTexture.name);
	}
	else useTexture = false;
	
	useMOCursorChange = controlCenter.GetComponent(GameManager).useMOCursorChange;

	useMOMaterialChange = controlCenter.GetComponent(GameManager).useMOMaterialChange;


}


function OnMouseEnter () {

	// if navigating [is true], exit the function now
	if (controlCenter.GetComponent(GameManager).navigating) return;

	//print (DistanceFromCamera());

	if (DistanceFromCamera() > triggerDistance + moOffset) return;

	if (useMOCursorChange) gamePointer.SendMessage("CursorColorChange", true); // turn the pointer back to white 

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

    if (useMOCursorChange) gamePointer.SendMessage("CursorColorChange", false); // turn the pointer white
	renderer.material = originalMaterial;

}



function OnMouseDown () {

	// exit if we are not within range 
	if (DistanceFromCamera() > triggerDistance) return;

	print ("we have mouse down on " + this.name); 
	// turn the object back to original if it is being used
	if(useMOMaterialChange) renderer.material = originalMaterial;  

	// *** send a message turn the cursor color back to original if it is being used
	if(useMOCursorChange) { 
	   gamePointer.GetComponent(CustomCursor).SendMessage("CursorColorChange",false);  
	}



}



function DistanceFromCamera () {

   // get the direction the camera is heading so you only process stuff in the line of sight
   var heading : Vector3 = transform.position - cam.transform.position;
   //calculate the distance from the camera to the object 
   var distance : float = Vector3.Dot(heading, cam.transform.forward);
   return distance;
}
