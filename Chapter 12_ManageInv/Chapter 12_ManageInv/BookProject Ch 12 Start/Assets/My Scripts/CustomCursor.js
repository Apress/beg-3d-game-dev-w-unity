var controlCenter : GameObject; 
private var mouseOverColor : Color;
var defaultCursor : Texture; // load in the texture for the default cursor
private var currentCursor : Texture; // the current texture on the cursor


function Start () {

	guiTexture.enabled = false;  // disable the GUITexture object at start up
	mouseOverColor= controlCenter.GetComponent(GameManager).mouseOverColor;
	defaultCursor = guiTexture.texture; // from the default cursor at start up
	currentCursor = defaultCursor;

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

function SwapCursor (newCursor : Texture) {

	gameObject.guiTexture.texture = newCursor; //change the object’s texture
	currentCursor = newCursor; // update the variable that holds the texture
	gameObject.guiTexture.enabled = false; //
 }

function ResetCursor () {

	gameObject.guiTexture.texture = defaultCursor; //change back to default texture
	currentCursor = defaultCursor; // update the variable that holds the texture
}
