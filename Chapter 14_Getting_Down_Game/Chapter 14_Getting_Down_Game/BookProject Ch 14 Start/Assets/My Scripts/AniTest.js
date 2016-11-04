var aniClip : AnimationClip;
var parent : GameObject;
var audioDelay : float = 0.0; 

function OnMouseDown () {

	// if there is an animation on this script’s object…
	if (animation) animation.Play(aniClip.name);

	// else there wasn’t, so it must be on the parent
	else parent.animation.Play(aniClip.name);
	
	//check to make sure an Audio Source component exists before playing
	if (GetComponent(AudioSource)) {
	   yield new WaitForSeconds(audioDelay);
	   audio.Play();
	}


}

