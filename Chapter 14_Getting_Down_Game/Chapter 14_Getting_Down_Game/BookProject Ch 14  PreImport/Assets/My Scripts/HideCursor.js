
function Update () {

   if (Input.GetButton("Horizontal") || Input.GetButton("Vertical") ||
      Input.GetButton("Turn") || Input.GetButton("ML Enable") ){
     // a navigation key is being pressed, so hide the cursor 
    Screen.showCursor = false;
    }

   else {
   // no navigation keys are being pressed, so show the cursor again
   Screen.showCursor = true;
   }

}