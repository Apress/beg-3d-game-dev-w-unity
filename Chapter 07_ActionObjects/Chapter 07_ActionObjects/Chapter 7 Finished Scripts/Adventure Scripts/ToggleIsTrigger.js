function Update () {

   // call the ToggleTrigger function if the player presses the t key
   if (Input.GetKeyDown("t")) ToggleTrigger();

}

function ToggleTrigger () {

	if (collider.isTrigger == true) {
		collider.isTrigger = false;
		print ("Closed");
		}
	else {
		collider.isTrigger = true;
		print ("Opened");
		}
}
