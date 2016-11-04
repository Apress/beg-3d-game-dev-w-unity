var outsideSounds : GameObject[]; // the sound prefabs we want to control


function Switcher (state : boolean) {

	for (var s in outsideSounds) {
		if(state) s.GetComponent(AudioSource).enabled = true;
		else s.GetComponent(AudioSource).enabled = false;
	}
}