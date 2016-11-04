
var dropBox : GameObject; // the location/object this box is checking
private var contents : GameObject; // the object currently found in the dropBox

function OnTriggerEnter (other : Collider) {

   if (other.name ==  dropBox.name) return;

   if (other.gameObject.tag == "ActionObject" ) {
      contents = other.gameObject; // store the found action object
	  dropBox.GetComponent(Interactor).currentState = 1;
	  dropBox.active = false;
   }
}

function CheckState () {

   yield new WaitForSeconds(0.5); // allow auxiliary objects to finish processing

   //turn on the drop box
   dropBox.active = true;
   contents = null; // clear the contents before the next check
   dropBox.GetComponent(Interactor).currentState = 0;

   animation.Play(); // do the intersection check

}
