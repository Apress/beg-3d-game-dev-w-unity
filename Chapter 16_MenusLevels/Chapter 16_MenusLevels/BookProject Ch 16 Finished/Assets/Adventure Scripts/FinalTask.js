//var audioSource : GameObject; // object with the final voice message rtedundant
//private var cam : GameObject; // the main camera *******removed
private var end = false; // flag to block user input
var voiceSource : GameObject; // object with the final voice message******** synthUp
var music : AudioClip;


function Start () {

   //cam = GameObject.Find("Main Camera");

}

function Update () {

    // Keep player input disabled
    if (end) Input.ResetInputAxes() ;
  
}

function DoTheJob () {

	GameObject.Find("Control Center").GetComponent(MenuManager).end = true;
	GameObject.Find("Control Center").GetComponent(MenuManager).menuMode = true; //block mousevers
	GameObject.Find("Control Center").GetComponent(GameManager).end = true;

   //block the user input
   end = true; // turn on the flag
   

    //trigger the audio clip
    voiceSource.audio.Play(); //***************

   //give player three seconds to read take message **************change
   yield new WaitForSeconds(3);



    //Play the Field of view Change
     animation.Play("pull back"); //nuke cam
	 
	 //trigger the music clip
	// PlayClipAtPoint(music,Vector3(0,0,0),0.5); // nuke audioSource
	 audio.Play();
 

   //prevent mouseovers and turn off cursor ********************change this- turn off inventory icon
   GameObject.Find("Camera Pointer").active = false;
  
    //go to credits level
    //yield new WaitForSeconds(5);
    //Application.LoadLevel ("Credits");
	//roll credits
	yield new WaitForSeconds(2);
	GameObject.Find("Control Center").GetComponent(MenuManager).rollCredits = true; //******8swapped
	GameObject.Find("Control Center").GetComponent(MenuManager).base = Time.time;



}
