
function Start () {

   // set the GUI Texture  to match the screen size on start up
   guiTexture.pixelInset = Rect (0, 0, Screen.width, Screen.height);

} 

function OnMouseDown () {

   GameObject.Find("Camera Inventory").SendMessage("ToggleMode");

} 
