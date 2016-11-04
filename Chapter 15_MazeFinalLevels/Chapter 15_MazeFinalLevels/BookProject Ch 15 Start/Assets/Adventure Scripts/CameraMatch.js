
// Camera Match
//
// Purpose: This script moves object towards a target location while looking at a target object. The idea is to move the player character to a good spot to see an animation, such as the opening of a chest or similar. 
//
// Usage: Drop onto the object to be moved (ie: the player), set a destination location, and object to look at. Also note that the camera used in the scene is assume to be "Main Camera" if this is not the case, that parameter will need to be changed in Start().


var targetLook : Transform; // target to look at
var targetPos : Transform ; // destination to look from

private var source : Vector3 ; // original First person controller position

var animationTime: float = 0.0; // time after the match for some other animation to play / finish playing
private var startTime : float;

private var start : Transform; // starting position/transform
private var end : Transform; // ending position/transform

private var endTime : float = 0.0 ;
var matchTime : float = 1.0 ; // seconds duration of the camera matchXXX
private var isLookAtSmooth  = true ; // Smooth look at when matching.

var fPCamera : GameObject; // main camera. 
private var camRotX : float ; // store the camera rotation when starting

private var matching: boolean = false ; // so you don't get interrupted once started
private var justMatched : boolean = false ; // so you know when we are finished

private var camMouseScript : MouseLookRestricted ;


function Start () {

   fPCamera = GameObject.Find("Main Camera");
   camMouseScript = fPCamera.GetComponent("MouseLookRestricted") ;

   endTime = animationTime* -2 ; // fudge factor: turns off cam control at first
}



function Update() 
{

	if (!matching) return;
	
	if ( Time.time < endTime ) {

		// Do movement

		var t = ( Time.time - endTime + matchTime ) / matchTime; // Goes from 0 to 1
		WaveLike ( t, 9 ) ; // make movement start and end slower- ease-in/ease-out
		var toPos = Vector3 ( targetPos.position.x, targetPos.position.y, targetPos.position.z ) ;
		 transform.position = Vector3.Lerp ( source, toPos , t ) ;


		// Do rotation
		if ( isLookAtSmooth ) {
		  // Separate horizontal & vertical movement, apply to player & cam objects, respectively

		  // Horizontal
		  var playerAngle = Mathf.Atan2 ( targetLook.position.x - transform.position.x,targetLook.position.z - transform.position.z ) * Mathf.Rad2Deg ;
		  var playerRot = Quaternion.AngleAxis ( playerAngle, Vector3.up ) ;
		  transform.rotation = Quaternion.Slerp ( transform.rotation, playerRot, t ) ;

		  // Vertical , rotate camera towards target	
		  var targetPoint = targetLook.position;
		  var targetRotation = Quaternion.LookRotation (targetPoint -  fPCamera.transform.position, Vector3.up);
		//get distance away from target so you can adjust speed of match
		var dist = Vector3.Distance(targetPos.position, transform.position);
		  fPCamera.transform.rotation = Quaternion.Slerp(fPCamera.transform.rotation,targetRotation, Time.deltaTime * (10-dist));
		 
		} // close isLookAtSmooth

		  justMatched = true ;


		// Disable player navigation input while this script controls player position
		Input.ResetInputAxes() ;

		} // close the original conditional

		else {
		   if ( justMatched )   {

			  // Keep player input disabled
			  Input.ResetInputAxes() ;
			 //report the new rotation back to the mouselook script- very important!
			  camMouseScript.ResetRotationY ( -1 * fPCamera.transform.rotation.eulerAngles.x ) ;

			  toPos = Vector3 ( targetPos.position.x, targetPos.position.y, targetPos.position.z ) ;
			  transform.position = toPos ;
			  
			  justMatched = false ;
		   }

		if ( Time.time < ( endTime + animationTime ) ) { // if there are other animations to watch

			// Keep player input disabled
			Input.ResetInputAxes() ;
		}

	   else {
		 // Done with match. Reset for next time
		  matching = false;

		 // enable mouse again
		 //Screen.lockCursor = false;

	   // flag for cursor visibility and mouse functions- 
	   gameObject.Find("Control Center").GetComponent(GameManager).camMatch = false; 

	   }

	} // end else

} // end Update function



static function WaveLike ( tStep, iterations ) {

   for ( var i = 0 ; i < iterations ; i++ ) {
      tStep = ( 1 - Mathf.Cos ( tStep * Mathf.PI ) ) / 2 ;
   }
   return tStep ;

}

function Match() {

   endTime = Time.time + matchTime ;

   source = transform.position ;

   // get current camera x
   camRotX = fPCamera.transform.rotation.x ;

   
   // disable mouse- this forces the cursor position to the center of the screen
   Screen.lockCursor = true;
   
	matching = true; // start the camera match

	yield new WaitForSeconds(1.0);

	// enable mouse again
	Screen.lockCursor = false;

} 
