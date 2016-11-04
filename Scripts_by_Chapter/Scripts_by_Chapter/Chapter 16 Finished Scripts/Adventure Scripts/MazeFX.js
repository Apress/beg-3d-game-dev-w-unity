function OnTriggerEnter () {
   audio.Play(); // start the sound
   GameObject.Find("Point Light FX").animation.Play();
}

function OnTriggerExit() {
   audio.Stop(); // stop the sound
   GameObject.Find("Point Light FX").animation.Play();
}
