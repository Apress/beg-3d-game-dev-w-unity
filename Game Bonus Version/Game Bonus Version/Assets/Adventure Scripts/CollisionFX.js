// play sound on bounces

var soundFX : AudioClip;
var minVelocity : float = 1.0;
var hitVolume : float = 1;

// Play a sound when object hits an object with a big velocity
function OnCollisionEnter(collision : Collision) {
	// if there's no audio source component do this
	if (collision.relativeVelocity.magnitude > minVelocity) {
		AudioSource.PlayClipAtPoint(soundFX, transform.position);
	}
	// if there is, play a random pitch
	if(gameObject.GetComponent(AudioSource) != null) {
		audio.pitch = Random.Range(0.7,1.2 );
		audio.volume = hitVolume;
		audio.PlayOneShot(soundFX);

	}
}