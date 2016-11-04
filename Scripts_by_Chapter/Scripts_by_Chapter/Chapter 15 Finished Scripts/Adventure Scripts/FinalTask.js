var audioSource : GameObject; // object with the final voice message
private var cam : GameObject; // the main camera
private var end = false; // flag to block user input

function Start () {

   cam = GameObject.Find("Main Camera");

}

function Update () {

    // Keep player input disabled
    if (end) Input.ResetInputAxes() ;
  
}

function DoTheJob () {

   //block the user input
   end = true; // turn on the flag

   //give player three seconds to read take message
   yield new WaitForSeconds(3);



    //Play the Field of view Change
    cam.animation.Play("pull back");
  
    //trigger the audio clip
    audioSource.audio.Play();
	
   //prevent mouseovers and turn off cursor
   GameObject.Find("Camera Pointer").active = false;
  
    //go to credits level
    //yield new WaitForSeconds(5);
    //Application.LoadLevel ("Credits");

}
