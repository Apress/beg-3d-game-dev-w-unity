private var navigating : boolean;   // flag for navigation state
private var gamePointer : GameObject;
var mouseOverColor = Color.green;  
var mouseOverMaterial : Material;
var useMOCursorChange : boolean = true;
var useMOMaterialChange : boolean = false;

function Awake () {

   Screen.SetResolution (1024, 768, false);

}

function Start () {

   Screen.showCursor = false; // hide the os cursor
   // assign the actual GamePointer object to the gamePointer variable
   gamePointer = GameObject.Find("GamePointer");

}


function Update () {

   if (Input.GetButton("ML Enable") || Input.GetButton("Horizontal") || 
      Input.GetButton("Vertical") || Input.GetButton("Turn")) {		
      navigating = true;
	  gamePointer.guiTexture.enabled = false; // turn off the pointer
   }
   else {
      navigating = false;
	  gamePointer.guiTexture.enabled = true; // turn on the pointer
   }

}
