var animationTarget : GameObject; // object with the animations
var topiFruit : GameObject; // 

function Start () {

	// hide trunk topi
	topiFruit.active = false;

}

function DoTheJob  () {
	// show trunk topi
	topiFruit.active = true;
	yield new WaitForSeconds(3); // pause before starting
	animationTarget.animation.Play("end game");

}
