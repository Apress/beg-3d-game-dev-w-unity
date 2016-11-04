var customSkin : GUISkin; 
var customGUIStyle : GUIStyle; // override the skin  
var boxStyleLabel : GUIStyle; // make a label that looks like a box  

var defaultCursor : Texture; // load in the texture for the default cursor
private var currentCursor : Texture; // the current texture on the cursor
private var showMOCursorChange : boolean; //flag for changing the cursor color
private var showPointer : boolean; // flag for pointer visibility 
private var iMode = false; // flag for whether inventory mode is off or on

private var navigating : boolean;   // flag for navigation state
var mouseOverColor = Color.green;  
var mouseOverMaterial : Material;
var useMOCursorChange : boolean = true;
var useIconColorChange = true;
var useMOMaterialChange : boolean = false;
var useText : boolean = true; // flag to suppress or allow all text
var showText : boolean= false; // flag to toggle text during play
var useLongDesc : boolean = true;
private var showShortDesc : boolean = true; 
private var showLongDesc : boolean = true;
private var showActionMsg : boolean = false; 
private var shortDesc : String = "";
private var longDesc : String = "";
private var actionMsg : String = ""; 
private var inRange : boolean; // distance flag for long desc
private var resetMO : boolean = false; // flag to reset mouseover after pick  
private var actionObject : String; // the name of the last action object to turn on the actionMsg 

//sound volumes
var soundFXVolume : float = 1.0; // sound effects volume
var ambientSoundVolume : float = 1.0; // ambient background sounds volume
var backgroundMusicVolume : float = 1.0; // so we don’t have to force our music on the player
var voiceVolume : float = 1.0; // in case we have character voices


function Awake () {

   Screen.SetResolution (1024, 768, false);

}

function Start () {

   Screen.showCursor = false; // hide the os cursor
   
  showPointer = true; // enable the pointer at start up
  currentCursor = defaultCursor; 


}


function Update () {

   if (Input.GetButton("ML Enable") || Input.GetButton("Horizontal") || 
      Input.GetButton("Vertical") || Input.GetButton("Turn")){
      navigating = true;
   }
   else {
      navigating = false;
   }
} 



function OnGUI () {

   GUI.skin = customSkin;
	
   if (useText){  //global toggle
      if (showActionMsg) GUI.Label (Rect (Screen.width/2 - 300, Screen.height - 47, 600, 35), actionMsg);
      if (showText && !showActionMsg){ //local toggle
         if (useLongDesc) {
         if (showLongDesc && inRange) GUI.Label (Rect (Screen.width/2 - 250, Screen.height - 37, 500,35), longDesc);
        }
        if (showShortDesc) GUI.Label (Rect (Screen.width/2 - 250, Screen.height - 65, 500,35), shortDesc, customGUIStyle);
     }
   }

//~ if (GUI.Button (Rect(5,Screen.height - 35,32,32),"i")) {
//~ // call the Toggle Mode function when this button is picked
  //~ GameObject.Find("Camera Inventory").SendMessage("ToggleMode");
//~ } 

   //reset mouseovers 
   if (resetMO) GUI.Box (Rect (0, 0, Screen.width,Screen.height),"",customGUIStyle);
   
	 if (showPointer && !navigating) {

	   var pos = Input.mousePosition; //get the location of the cursor
	   if(useMOCursorChange && showMOCursorChange ) GUI.color = mouseOverColor;  
	   else GUI.color = Color.white;
	   GUI.DrawTexture (Rect(pos.x, Screen.height - pos.y, 32,32), currentCursor);

	} 
  
}




function ResetMouseOver () { 

	yield new WaitForSeconds(0.5);
	resetMO = true;
	yield;
	resetMO = false;

}


function ResetCursor() {
   currentCursor = defaultCursor; // reset the cursor to the default
}


function AddToInventory (object : GameObject) {

   print ("adding " + object.name + " to inventory");

}

function RemoveFromInventory (object : GameObject) {

   print ("removing" + object.name + "  from inventory");

}











