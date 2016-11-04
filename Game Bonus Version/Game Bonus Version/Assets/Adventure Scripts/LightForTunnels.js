var torchLight : Light; // the light to manage
var lightIcon : GameObject; // the icon, so its state can be checked
var newState : boolean = false; // state to turn the light to

function OnTriggerEnter () {

	var iconState = lightIcon.GetComponent(Interactor).currentState;
	
	if (iconState > 0) { // the player has the light glyph in inventory, so turn the light off/on
		if (newState == true) torchLight.enabled = true;
		else torchLight.enabled = false;
	}
}