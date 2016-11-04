private var controlCenter : GameObject;
private var defaultCursor : Texture;
private var currentCursor : Texture;

function Start () {

   controlCenter = GameObject.Find("Control Center");
   defaultCursor = controlCenter.GetComponent(GameManager). defaultCursor;

} 



function OnMouseDown () {

	// check the current cursor against the default cursor

	currentCursor = controlCenter.GetComponent(GameManager). currentCursor;

	if (currentCursor == defaultCursor) return; // take no action- it was the default cursor

	else { // there is a an action icon as cursor, so process it

	   // use the cursor texture's name to find the GUI Texture object of the same name   
	   var addObject = GameObject.Find(currentCursor.name);

	  // update the icon's current state to in inventory, 1, in the Interactor script
	  addObject.GetComponent(Interactor).currentState = 1;

	  //after you store the cursor's texture, reset the cursor to default
	   controlCenter.SendMessage("ResetCursor");

	  // and add the new object to inventory
	  controlCenter.SendMessage("AddToInventory", addObject); 

	} 


} 
