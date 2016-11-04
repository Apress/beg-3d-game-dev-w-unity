var sendToObject  : GameObject;  
var correctObject: GameObject; //this is the only object we allow to trigger the event
var targetFunction : String; // the name of the function to call

function OnTriggerEnter (object : Collider) {

	//print (object.name); // this is the name of the object triggered the event
	 if(object == correctObject.collider) sendToObject.SendMessage(targetFunction);

}

function OnTriggerExit (object : Collider) {

	//print (object.name); // this is the name of the object triggered the event
	 if(object == correctObject.collider) sendToObject.SendMessage(targetFunction);
}
