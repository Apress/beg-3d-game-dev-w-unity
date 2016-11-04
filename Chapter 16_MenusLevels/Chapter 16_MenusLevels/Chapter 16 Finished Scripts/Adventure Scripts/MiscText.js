// list of really generic replies for wrong picks
var gameGenericReplies : String[];
var gameLessGenericReplies : String[];
private var oldNum = -1; //var to store the previous random number
private var oldReallyNum = -1; //var to store the previous random number


function RandomReply () { // for non-default cursor
   var num = Random.Range(0,gameLessGenericReplies.length);// get a random number
   while (num == oldNum) num = Random.Range(0,gameLessGenericReplies.length);
   oldNum = num; // store the new random number for next time
   return gameLessGenericReplies[num]; // send the contents of that element back
}

function ReallyRandomReply () { // for default cursor
   var num = Random.Range(0,gameGenericReplies.length);// get a random number
   while (num == oldReallyNum) num = Random.Range(0,gameGenericReplies.length);
   oldReallyNum = num; // store the new random number for next time
   return gameGenericReplies[num]; // send the contents of that element back
}
