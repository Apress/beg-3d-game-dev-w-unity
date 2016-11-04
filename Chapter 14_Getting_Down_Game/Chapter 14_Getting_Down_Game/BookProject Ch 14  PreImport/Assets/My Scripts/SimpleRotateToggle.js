var myDegrees = 100;

private var rotationState = 1; // this variable keeps track of the state of the rotation- whether it is off or on- 1 is on, 0 is off

function Update () {

   if (rotationState == 1) {
		transform.Rotate(0, myDegrees * Time.deltaTime, 0);
   }


}

function OnMouseDown () {

	if (rotationState == 1) {

		rotationState = 0;
	
	}

	else if (rotationState == 0) {

		rotationState = 1;

	}

	print("State = " + rotationState);
}
