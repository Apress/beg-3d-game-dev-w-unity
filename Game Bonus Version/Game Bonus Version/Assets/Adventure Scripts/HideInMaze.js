//hide this object in the maze at start up
var mazeWalls : GameObject; // 
var thisObject : GameObject; // 

function Start() {

	mazeWalls.SendMessage("FindDropPoint" , thisObject); // send to maze manager script

}

