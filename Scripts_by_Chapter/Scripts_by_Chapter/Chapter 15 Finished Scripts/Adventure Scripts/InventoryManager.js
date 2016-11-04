var iMode = false; // local flag for whether inventory mode is off or on
private var controlCenter : GameObject;
var fPController : GameObject;
var fPCamera : GameObject;


function Start () {
   camera.enabled = false;
   controlCenter = GameObject.Find("Control Center");// access the control center
   iMode = controlCenter.GetComponent(GameManager).iMode;
}


function Update () {

	if (Input.GetKeyDown("i")) ToggleMode(); // call the function if i key is pressed
	
}

// toggle inventory visibility
function ToggleMode () {
 
  if (iMode) { // if you are in inventory mode, turn it off
      camera.enabled = false;// turn off the camera
	fPController.GetComponent(CharacterMotor).enabled = true; // turn on navigation
	fPController.GetComponent(FPAdventurerInputController).enabled = true; // turn on navigation
	fPController.GetComponent(MouseLookRestricted).enabled = true; // turn on navigation
	fPCamera.GetComponent(MouseLookRestricted).enabled = true;

      iMode = false; // change the flag
	  yield new WaitForSeconds(0.5); // delay changing the iMode flag
      controlCenter.GetComponent(GameManager).iMode = false; // inform the manager
  }
  else { // else it was off so turn it on
      camera.enabled = true;// turn on the camera
	fPController.GetComponent(CharacterMotor).enabled = false; // turn off navigation
	fPController.GetComponent(FPAdventurerInputController).enabled = false; // turn off navigation
	fPController.GetComponent(MouseLookRestricted).enabled = false; // turn off navigation
	fPCamera.GetComponent(MouseLookRestricted).enabled = false;

     iMode = true; // change the flag
     controlCenter.GetComponent(GameManager).iMode = true; // inform the manager
  }

}

function DoTheJob () {

   if(iMode) ToggleMode ();

}
