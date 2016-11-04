function Awake () {

   PoofTopi ();

}

function OnCollisionEnter () {

   audio.Play(); // play the default  hit sound

}


function PoofTopi () {

   yield new WaitForSeconds(5);
   GameObject.Find("Poof").GetComponent(ParticleEmitter).emit = true;
   animation.Play(); // shrink the topi

   yield new WaitForSeconds(1);
   Destroy (gameObject); // destroys the gameobject and its children

}
