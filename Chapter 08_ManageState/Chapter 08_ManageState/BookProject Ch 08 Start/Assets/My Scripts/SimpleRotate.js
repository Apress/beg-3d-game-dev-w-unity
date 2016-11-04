var myDegrees = 100;

private var rotationState = 1; // this variable keeps track of the state of the rotation- whether it is off or on- 1 is on, 0 is off

function Update () {

	transform.Rotate(0,myDegrees * Time.deltaTime,0);

}

