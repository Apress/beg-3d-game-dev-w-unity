var twoStates : boolean = false; // default for single state objects

var aniObject : GameObject; // if assigned this object’s animation will be triggered
var aniClip0 : AnimationClip;
var aniClip1 : AnimationClip;
var audioClip0 : AudioClip;
var audioClip1 : AudioClip;
var audioDelay0 : float = 0.0;
var audioDelay1 : float = 0.0;

private var aniTarget : GameObject;
private var aniClip : AnimationClip;
private var fXClip : AudioClip; 
private var audioDelay : float;
private var objState : boolean = true;  // true is the beginning state, false is the second state 


function Start () {

   if (aniObject) aniTarget = aniObject; // if one was assigned, it is the target- it must contain an animation

   else aniTarget = this.gameObject; // else the target is the object this script is on

}



function OnMouseDown () {

	if (!twoStates) objState = true;  // if twoStates is Not true
	
	if (objState) {    // if objState is true ~ open/1
	   objState = false;  // so change its state to closed
	   aniClip = aniClip0;  // set the new clips and delay
	   fXClip = audioClip0;
	   audioDelay = audioDelay0; 
	}
	 else  {  // the objState must be false ~ closed / 0
	   objState = true;  // so change its state to opened
	   aniClip = aniClip1;  // set the new clips and delay
	   fXClip = audioClip1;
	   audioDelay = audioDelay1; 
	}

	//play the specified animation on the specified object
	aniTarget.animation.Play(aniClip.name);

	
	//check to make sure an Audio Source component exists before playing
	if (aniTarget.GetComponent(AudioSource)) {
		yield new WaitForSeconds (audioDelay);
		aniTarget.audio.PlayOneShot(fXClip); 
	}



}

