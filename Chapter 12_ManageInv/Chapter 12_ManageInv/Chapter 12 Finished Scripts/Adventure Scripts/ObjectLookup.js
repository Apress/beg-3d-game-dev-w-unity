// make a Unity array for the three possible states of the object, each will have:
// cursor, new state, other object, its state, another object, its state, etc...
// use ‘default’ for the default cursor name  
var lookupState0 : String[];  //declare an array of string type content 
var lookupState1 : String[];  //declare an array of string type content 
var lookupState2 : String[];  //declare an array of string type content 

var repliesState0 : String[];
var repliesState1 : String[];
var repliesState2 : String[];

var genericReplies : String[]; // Add one reply for each state


// make a regular array of type Array with 3 elements to process the selected element’s contents 
private var stateArray = new Array [3]; 
// make a regular array holding 3 elements to hold the replies for each state 
private var replyArray = new Array [3];

//Gain access to
private var controlCenter : GameObject; //where the GUI is updated


var state : int; // a variable to hold the element number to process

function Start () {

   controlCenter = gameObject.Find("Control Center"); //find the control center by name

   // load the Unity string arrays into the JavaScript array elements 	
   stateArray[0] = lookupState0;
   stateArray[1] = lookupState1;
   stateArray[2] = lookupState2;
   
	// load the Unity string arrays into the JavaScript array elements
	replyArray[0] = repliesState0;
	replyArray[1] = repliesState1;
	replyArray[2] = repliesState2;


}


//look up the state of the object to see what needs to happen
function LookUpState (object : GameObject, currentState: int, picker : String) {

	var element : int = 0; // variable to track the element number for a match 

	// check the passed- in cursor texture to see if it is the default cursor rename it if so
	if (picker == controlCenter.GetComponent(GameManager).defaultCursor.name )	var matchCursor = "default";
	else matchCursor = picker;

   for(var contents : String in stateArray[currentState]) {

   // split the contents into a temporary array
   var readString : String[] = contents.Split(",".Chars[0]); 


      // if there is a match for the cursor…
      if(readString[0] == matchCursor) {
			//print ("we have a match with cursor: "+ matchCursor + " on " + object.name);
			//send the correct text message off to the GameManager
			var actionMsg : String = replyArray[currentState][element];
			controlCenter.GetComponent(GameManager).actionMsg= actionMsg;
			TimeAdjuster(actionMsg); //send the message off to adjust processing time


			  //change the object’s state to the new state by calling its ProcessObject function
			  var nextState : int = parseInt(readString [1]); //convert the string to an integer 
			  object.SendMessage("ProcessObject", nextState); //send the new state to the object

			//process auxiliary objects if there are any
			var tempLength = (readString.length); //get the length of the current stateArray

			if(tempLength > 2){ // that means there are auxiliary objects
			   for (var x = 2; x < tempLength; x = x + 2) { // go through the rest of the array by 2s

			 //check if the first character is a space, and if so, start the string at the second element
			   var tempS = readString[x];
			   if (tempS.Substring(0,1) == " ") tempS = tempS.Substring(1);

			//check for special cases here- we will come back to this later

			var auxObject = gameObject.Find(tempS); 
			var newState = parseInt(readString[x+1]);
			
			// process the auxiliary object
			print (auxObject.name + " new state: " + newState);
			auxObject.SendMessage( "ProcessObject",newState);

		} // close the for loop
	   } // close if clause for the auxiliary objects
	
	
		return; // found and processed a match, so leave *******************

    } // close there is a match
	 
	 controlCenter.GetComponent(GameManager).showPointer = true;
		
	 element ++; //increment the element counter by 1

   } // end for loop

	// The current cursor, passed in as "picker", was not a match with an inventory object, so did not provoke any reaction- show a reply
	if (gameObject.tag != "InventoryObject") HandleNoMatchReplies(picker); 


	else if (matchCursor != "default"){  //swap out the cursor with the object it picked

		 //change the picked object's state to 10,
		GetComponent(Interactor).currentState = 10;
		//change the cursor object's state to 11
		GameObject.Find(picker).GetComponent(Interactor).currentState = 11;
		//store this object's current inventory element number on the GameManager
		controlCenter.GetComponent(GameManager).replaceElement = GetComponent(Interactor).iElement; 

	   //put the old cursor in inventory
	   GameObject.Find(picker).SendMessage("ProcessObject",1);

	   //pick up the new cursor
	   SendMessage("ProcessObject",2);
	   
	   HandleCursorSwapReplies (picker); // build a reply for the swapped cursor 
	} 



}


// function to calculate extra processining time to read action message
function TimeAdjuster(actionMsg : String) {

	var stringLength: int  =  actionMsg.length;
    var addTime = stringLength / 20.0 -1.5; //calculate the amount of time to add
    if (addTime >= 0) GetComponent("Interactor").timeLimit2 = GetComponent("Interactor").timeLimit2 + addTime;


}

function HandleNoMatchReplies (picker : String) {
	   picker = picker.ToLower(); // make it lower case
	   picker = picker.Substring(0,picker.length - 5); // strip off the icon part of the name
	   var tempObjectName = this.GetComponent("Interactor").currentObjectName.ToLower();
	   var tempMsg = "The " + picker + " does not seem to affect the " + tempObjectName ;
	   //send the GameManager the action text
	   controlCenter.GetComponent(GameManager).actionMsg=tempMsg;
	   //tell the GameManager to show the action text
	   controlCenter.GetComponent(GameManager).showActionMsg=true;
	   //wait two seconds then turn off the action text and leave the function
	   yield new WaitForSeconds(2.0);
	   controlCenter.GetComponent(GameManager).showActionMsg= false;
	   return;
	}


function HandleCursorSwapReplies (picker : String) {
	   picker = picker.ToLower(); // make it lower case
	   picker = picker.Substring(0,picker.length - 5); // strip off the icon part of the name
	   var tempObjectName = this.GetComponent("Interactor").currentObjectName.ToLower();
	   var tempMsg = "You exchange the " + picker + " for the " + tempObjectName ;  
	   //send the GameManager the action text
	   controlCenter.GetComponent(GameManager).actionMsg=tempMsg;
	   //tell the GameManager to show the action text
	   controlCenter.GetComponent(GameManager).showActionMsg=true;
	   //wait two seconds then turn off the action text and leave the function
	   yield new WaitForSeconds(2.0);
	   controlCenter.GetComponent(GameManager).showActionMsg= false;
	   return;
	}













