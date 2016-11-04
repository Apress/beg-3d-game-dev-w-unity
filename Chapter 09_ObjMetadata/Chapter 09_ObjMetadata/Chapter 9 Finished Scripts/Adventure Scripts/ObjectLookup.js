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


var state : int; // a variable to hold the element number to process

function Start () {

   // load the Unity string arrays into the JavaScript array elements 	
   stateArray[0] = lookupState0;
   stateArray[1] = lookupState1;
   stateArray[2] = lookupState2;
   
	// load the Unity string arrays into the JavaScript array elements
	replyArray[0] = repliesState0;
	replyArray[1] = repliesState1;
	replyArray[2] = repliesState2;


}


function OnMouseDown () {

   print ("Results for state " + state ); 

   for (var contents : String in stateArray[state]) {
   //split the contents into a temporary array
   var readString : String[] = contents.Split(",".Chars[0]);
   }
   // now read the first two split out pieces (elements) back out 
   print ("elements in array for state " + state + " = " + readString.length);
   print ("Cursor = " + readString[0]);
   print ("New state = " + readString[1]);

   //now read through the remainder in pairs
   //iterate through the array starting at element 2 and incrementing by 2 
   //as long as the counting variable i is less than the length of the array
   for (var i = 2; i < readString.length; i= i + 2) {
      print ("auxiliary object = " + readString[i]);
      print (readString[i]  +  "’s new state = " + readString[i+1]); 
  }

} // close the OnMouseDown function
