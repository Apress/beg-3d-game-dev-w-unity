
function OnMouseEnter () {
   PulseIcon();
}

function  OnMouseDown () {
   // call the Toggle Mode function when this button is picked
  GameObject.Find("Camera Inventory").SendMessage("ToggleMode");

}

function PulseIcon () {
   // play the animation
   animation.Play("PulseIcon");
   
}

function DingIcon () {

   audio.Play(); 

}