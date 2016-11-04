var attachTo : GameObject;
var dropDelay : float = 0.0; 

function Start () {

attachTo = gameObject.Find(this.name);

}




function DoTheJob () {

	if (attachTo.GetComponent(Rigidbody) == null) {
		yield new WaitForSeconds(dropDelay);
		attachTo.AddComponent ("Rigidbody");
		//attachTo.rigidbody.collisionDetectionMode=CollisionDetectionMode.Continuous;
		}
	else attachTo.Destroy (rigidbody);


}

