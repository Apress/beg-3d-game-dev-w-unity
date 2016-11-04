var soundFX : AudioClip;
var fpController : GameObject; 
private var inProcess : boolean;



function OnTriggerEnter (object : Collider) {

	if (object.tag != "Player") return;
	if (!inProcess) {
		AudioSource.PlayClipAtPoint(soundFX,fpController.transform.position);
		inProcess = true;
	}
}


function OnTriggerExit () {

	inProcess = false;
	
}