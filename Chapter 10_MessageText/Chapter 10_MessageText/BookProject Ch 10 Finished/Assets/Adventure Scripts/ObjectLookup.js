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
private var gamePointer: GameObject;  // the cursor
private var controlCenter : GameObject; //where the GUI is updated


var state : int; // a variable to hold the element number to process

function Start () {

   gamePointer = gameObject.Find("GamePointer"); //find the cursor by object name
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
	if (picker == gamePointer.GetComponent(CustomCursor).defaultCursor.name) var matchCursor : String  = "default";
	else matchCursor = picker;


   //~ print ("Object: " + object.name);
   //~ print ("State: " + currentState);
   //~ print ("Picker: " + picker);

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

     }
     else print("no match for the " + object.name);
	 element ++; //increment the element counter by 1

   } // end for loop


}


// function to calculate extra processining time to read action message
function TimeAdjuster(actionMsg : String) {

	var stringLength: int  =  actionMsg.length;
    var addTime = stringLength / 20.0 -1.5; //calculate the amount of time to add
    if (addTime >= 0) GetComponent("Interactor").timeLimit2 = GetComponent("Interactor").timeLimit2 + addTime;


}

















