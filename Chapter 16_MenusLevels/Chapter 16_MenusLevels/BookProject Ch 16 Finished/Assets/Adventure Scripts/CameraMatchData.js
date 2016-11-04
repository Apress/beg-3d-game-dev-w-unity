// camera match metadata - resides on action objects
var targetPos : Transform; // where it ends up
var targetLook : Transform; // what object it looks at
var matchDelay = 0.0; // any delay time needed before the match
var matchTime = 1.0 ; //  the time the camera match animates over 
var matchReturn = false;// whether the player needs to be put back after the action 
private var returnPos : Transform; // position to reset player at if the match returns
private var controlCenter : GameObject;
private var fPCamera: GameObject; // 
private var fPController: GameObject; // 

function Start () {

   // gain access to these objects
   controlCenter = GameObject.Find("Control Center");
   fPCamera = GameObject.Find("Main Camera");
   fPController = GameObject.Find("First Person Controller");

} 

function DoTheJob () {

//send off position and look-at values to First Person Controller
fPController.GetComponent(CameraMatch).targetPos = targetPos; // the position target
fPController.GetComponent(CameraMatch).targetLook = targetLook; // the lookAt target
fPController.GetComponent(CameraMatch).matchTime = matchTime; // the match time
  
  
   // Wait for the delay
yield new WaitForSeconds(matchDelay);

   // trigger the camera match
fPController.SendMessage("Match"); // start the match

   // wait for it to play out


   // trigger the return

}







