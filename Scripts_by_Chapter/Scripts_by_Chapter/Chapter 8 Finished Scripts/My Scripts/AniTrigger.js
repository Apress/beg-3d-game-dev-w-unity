var aniObject : GameObject;
var aniClip : AnimationClip;
var aniClip2 : AnimationClip; // this will be called after the first is finished

function OnMouseDown () { 

	aniObject.animation.Play(aniClip.name);
	// wait the length of the first animation before you play the second
	yield new WaitForSeconds (aniClip.length); 
	aniObject.animation.Play(aniClip2.name); // this one is set to loop

}
