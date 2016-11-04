var fxParticles: GameObject; // the bouncer's particle system
private var fx : GameObject; // the one we will be creating



function OnTriggerEnter () {

   fx = Instantiate(fxParticles);

}

function OnTriggerExit () {

   KillEffect ();
}


//so we can turn off the particles from any event
function KillEffect () {

   yield;
   Destroy(fx, 5);

}
