var controlCenter : GameObject; 
private var mouseOverColor : Color;


function Start () {

	guiTexture.enabled = false;  // disable the GUITexture object at start up
	mouseOverColor= controlCenter.GetComponent(GameManager).mouseOverColor;

}

function Update () {
   // gets the current cursor position as a Vector2 type variable
   var pos = Input.mousePosition;

   // feed its x and y positions back into the GUI Texture object’s parameters 
   guiTexture.pixelInset.x = pos.x; 
   guiTexture.pixelInset.y = pos.y - 32; // offset to top
}

function CursorColorChange (colorize: boolean) {

	if (colorize)  guiTexture.color = mouseOverColor; 

	else  guiTexture.color = Color.white; 
}
