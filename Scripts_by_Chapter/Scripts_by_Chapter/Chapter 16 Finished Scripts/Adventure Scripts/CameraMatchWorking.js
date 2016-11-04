// Camera Match
//
// Purpose: This script moves object towards a target location while looking at a target object. The idea is to move the player character to a good spot to see an animation, such as the opening of a chest or similar. 
//
// Usage: Drop onto the object to be moved (ie: the player), set a destination location, and object to look at. Also note that the camera used in the scene is assume to be "Main Camera" if this is not the case, that parameter will need to be changed in Start().


var targetLook : Transform; // target to look at
var targetPos : Transform ; // destination to look from
var nose : Transform;

private var source : Vector3 ; // original First person controller position

private var animationTime = 0.0; // time after the snap for some animation to play / finish playing. ************used to be 3
private var startTime : float;

private var start : Transform; // starting transform
private var end : Transform; // ending transform

private var endTime = 0.0 ;
var matchTime = 1.0 ; // seconds duration of the movement.
private var isLookAtSmooth  = true ; // Smooth look at when matching.

private var fPCamera : GameObject; // main camera. 
private var camRotX : float ;

private var canMatch = true ;
private var justMatched = false ;

private var camMouseScript : MouseLookRestricted ;
private var matching = false; //to prevent constant evaluation

function Start () {

	fPCamera = GameObject.Find("Main Camera");
	camMouseScript = fPCamera.GetComponent("MouseLookRestricted") ;

	endTime = animationTime * -2 ; // fudge factor: turns off cam control at first
}


function Update() 
{

	if (!matching) return;

	if ( Time.time < endTime ) 	{

		// Do movement

		var t = ( Time.time - endTime + matchTime ) / matchTime ; // Goes from 0 to 1
		WaveLike ( t, 9 ) ; // make movement start and end slower
		var toPos = Vector3 ( targetPos.position.x, source.y, targetPos.position.z ) ; // note: did 'y' as source because targetPos wasn't perfect. to change it back, just set the 'y' as targetPos.position.y
		transform.position = Vector3.Lerp ( source, toPos , t) ;

		// Do rotation.
		if ( isLookAtSmooth ) {
			// Separate horizontal and vertical movement, apply to player and cam objects, respectivly.

			// Horizontal
			var playerAngle = Mathf.Atan2 ( targetLook.position.x - transform.position.x, targetLook.position.z - transform.position.z ) * Mathf.Rad2Deg ;
			var playerRot = Quaternion.AngleAxis ( playerAngle, Vector3.up ) ;
			transform.rotation = Quaternion.Slerp ( transform.rotation, playerRot, t ) ;

			//~ // Vertical
			//~ var relative = fPCamera.transform.InverseTransformPoint ( targetLook.position ) ;
			//~ var camAngle = Mathf.Asin ( relative.y / Vector3.Distance ( targetLook.position, transform.position ) ) * Mathf.Rad2Deg ;
			//~ fPCamera.transform.rotation.eulerAngles.x = Mathf.LerpAngle ( fPCamera.transform.rotation.eulerAngles.x, -camAngle, t ) ; // dunno why *=(-1) ... I'd say Unity is backwards from some coordinate systems.

	// Rotate towards target	
	var targetPoint = targetLook.position;
	var targetRotation = Quaternion.LookRotation (targetPoint - nose.transform.position, Vector3.up);
	nose.transform.rotation = Quaternion.Slerp(nose.transform.rotation, targetRotation, Time.deltaTime * 10.0);
	fPCamera.transform.rotation.eulerAngles.x = nose.transform.rotation.eulerAngles.x ;
	
	
	//~ // Rotate towards target	
	//~ var targetPoint = targetLook.position;
	//~ var targetRotation = Quaternion.LookRotation (targetPoint - nose.transform.position, Vector3.up);
	//~ nose.transform.rotation = Quaternion.Slerp(nose.transform.rotation, targetRotation, Time.deltaTime * 2.0);
	//~ fPCamera.transform.rotation.eulerAngles.x = nose.transform.rotation.eulerAngles.x ;	
	
	
	
		}

		justMatched = true ;

		// Disable player input while this script controls player position
		Input.ResetInputAxes() ;
		
	}// close the original conditional
	
	else 	{
		if ( justMatched ) {
		
		    // Keep player input disabled
			Input.ResetInputAxes() ; 
			//report the new rotation back to the mouselook script- very important!
			camMouseScript.ResetRotationY ( -1 * fPCamera.transform.rotation.eulerAngles.x ) ;
			

			toPos = Vector3 ( targetPos.position.x, source.y, targetPos.position.z ) ;
			transform.position = toPos ;
			
		
			justMatched = false ;
		}
		
		if ( Time.time < ( endTime + animationTime -2 ) ) {

			// Keep player input disabled
			Input.ResetInputAxes() ;
			
			//fPCamera.transform.LookAt ( targetLook ) ;
		}
		else 	{
			// Done with match. Reset for next time
			canMatch = true ;
			// enable mouse again
			//Screen.lockCursor = false;
			print ("Beep");
			gameObject.Find("Control Center").GetComponent(GameManager).camMatch = false;//show mouse 
			matching = false;
		}
	}// end else

} // end update



static function WaveLike ( tStep, itterations ) 
{
	for ( var i = 0 ; i < itterations ; i++ ) 
	{
		tStep = ( 1 - Mathf.Cos ( tStep * Mathf.PI ) ) / 2 ;
	}
	return tStep ;
}

function Match() 
{

	endTime = Time.time + matchTime;

	source = transform.position ;
	nose.transform.rotation.eulerAngles.x = fPCamera.transform.rotation.eulerAngles.x;
	camRotX = fPCamera.transform.rotation.x ;
	
	// disable mouse
	//Screen.lockCursor = true;
	
	matching = true;
	
}
