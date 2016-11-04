function Start () {
   //add adjustments to compensate for aspect ratio here
}

function Update () {
   if (Input.GetKeyDown("m")) { // check for m keyboard key press
      if(camera.enabled == false) camera.enabled = true;
      else camera.enabled = false;
   }
}
