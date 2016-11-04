private var inventoryItems : GameObject;
private var controlCenter : GameObject;
private var gridOffset : int; // gridoffset 
private var gridPosition : int; 
private var isActive : boolean = true; // keeps track of state 

function Start () {

   inventoryItems = GameObject.Find("Inventory Items");
   controlCenter = GameObject.Find("Control Center");
   gridOffset = controlCenter.GetComponent(GameManager).startPos;
   ArrowState (isActive); // update the arrow opacity 

} 
 
 
function OnMouseEnter () {

	if (!isActive) return; // skip the mouse over functionality if the arrow is not active 

	guiTexture .color = Color(0.75,0.75,0.75,1); // brighten the texture

} 

function OnMouseExit () {

	if (!isActive) return; // skip the mouse exit functionality if the arrow is not active 

	guiTexture .color = Color.grey; // return the texture to normal

} 



function ShiftGrid (shiftDirection: String) { 

	gridPosition = controlCenter.GetComponent(GameManager).gridPosition; // get latest gridPosition 

	// convert screen width from percent to pixels for shift amount
	 var amount = 1.0 * gridOffset/Screen.width; // divide screen width by the startPos 

   if (shiftDirection == "left")  {
      amount = -amount;
	  // hide the column on the left, send its top element
	  controlCenter.SendMessage("HideColumn", gridPosition *3); 
	  gridPosition ++; // increment the gridPosition counter by 1 

	  // show the new column on the right, send its top element
	  controlCenter.SendMessage("ShowColumn", gridPosition *3 + 6); 
	  //activate the right arrow
	  GameObject.Find("ArrowRight").SendMessage("ArrowState", true); 

	  // if there are no more columns to the right, disable the left arrow
	  var iLength = controlCenter.GetComponent(GameManager).currentInventoryObjects.length;
	  if(gridPosition *  3 + 9 >= iLength) ArrowState(false); // deactivate the left arrow 


   }
	// else it was the right arrow
	else {
		//hide the column on the right, send its top element
		controlCenter.SendMessage("HideColumn", gridPosition *3 +6); 
	    gridPosition --; // decrement the gridPosition counter by 1
		//show the column on the left, send its top element
		controlCenter.SendMessage("ShowColumn", gridPosition *3); 
		//activate the left arrow
		GameObject.Find("ArrowLeft").SendMessage("ArrowState", true); 
		if(gridPosition == 0) ArrowState(false);// deactivate the right arrow  
	} 
   
    inventoryItems.transform.position.x =  inventoryItems.transform.position.x + amount;

	controlCenter.GetComponent(GameManager).gridPosition = gridPosition; // send it off  

} 


function OnMouseDown () {

	if (!isActive) return; // skip the mouse over functionality if the arrow is not active 

   if (this.name == "ArrowLeft")  var shiftDirection = "left";
   else shiftDirection = "right";

   ShiftGrid (shiftDirection);

} 

function ArrowState (newState) {

   isActive = newState; 
   if (isActive) guiTexture.color  = Color(0.5,0.5,0.5,1.0); // full opacity
   else guiTexture.color = Color(0.5,0.5,0.5,0.2);// half opacity

} 
