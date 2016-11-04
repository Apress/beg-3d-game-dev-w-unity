private var motor : CharacterMotor;
//add these for arrow turn
var rotationSpeed : float = 20.0;

var hasParent : boolean = false; // flag to disable arrow turn while riding tram
private var rotationSensitivity = 0.1 ; // This makes rotationSpeed more managable 


// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
}

// Update is called once per frame
function Update () {
	// Get the input vector from kayboard or analog stick
	var directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
   
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}
	
	// Apply the direction to the CharacterMotor
	motor.inputMoveDirection = transform.rotation * directionVector;
	motor.inputJump = Input.GetButton("Jump");
}


//this is for the arrow turn functionality
function FixedUpdate () {

   if (Input.GetAxis("Turn") && hasParent != true) {	// the left or right arrow key is being pressed and the fpc is not parented
      // the rotation = direction * speed * sensitivity
      var rotation : float = ( Input.GetAxis("Turn") ) * rotationSpeed * rotationSensitivity ;
      // add the rotation to the current orientation amount	
      rotation = rotation + transform.eulerAngles.y ;
      // convert degrees to quaternion for the up axis, Y
      transform.localRotation = Quaternion.AngleAxis ( rotation, Vector3.up ) ;
	
   }
}

function ParentState (state : boolean) {
//print("message received " + state);
		if (state) hasParent = true;
		else hasParent = false;

}


// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")
