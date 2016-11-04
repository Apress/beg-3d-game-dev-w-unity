var dropObject : GameObject; // object to move to the drop point

function Start () {

   // trigger the wall rotations on all of the children
   gameObject.BroadcastMessage ("Scramble");
   var dropPoint = GameObject.Find(name);

} 



function ResetMaze () {
   // trigger the wall rotations on all of the children
   gameObject.BroadcastMessage("Scramble");
   
}

function FindDropPoint (weapon : GameObject) {

   //randomly generate the name of one of the 30 drop points 
   var num = Random.Range(1,30); 
	// parseInt changes the integer to a string
	if (num > 9) var name = "DropPoint" + parseInt(num); 
	else  name = "DropPoint0" + parseInt(num);
	
	var dropPoint = GameObject.Find(name);
	dropObject.transform.position.x = dropPoint.transform.position.x;
	//dropObject.transform.position.y = dropPoint.transform.position.y;
	dropObject.transform.position.z = dropPoint.transform.position.z;

	// get distances to surrounding walls clockwise from 12 o'clock
	var dForward = DistToWall(dropObject.transform .position, Vector3.forward);
	var dRight = DistToWall(dropObject.transform .position, Vector3.right);
	var dBackward = DistToWall(dropObject.transform .position,-Vector3.forward);
	var dLeft = DistToWall(dropObject.transform .position,-Vector3.right);
	
	var total = dForward + dRight + dBackward +   dLeft;	
	//print (name + "  " + dForward + "  " + dRight +  "  " +  dBackward +  "  " + dLeft + "  " + total);
	
	// check for single square trap
	if (total < 12) {
	   print ("trapped");
	   FindDropPoint(weapon); // get a new drop point
	}
	
	//relocate the weapon
	weapon.transform.position.x = dropObject.transform.position.x;
	weapon.transform.position.y = dropObject.transform.position.y;
	weapon.transform.position.z = dropObject.transform.position.z;

}

function DistToWall (origin: Vector3, direction : Vector3) {
    // pass the source/origin and direction in to be checked
    // do raycasting
   var hit : RaycastHit; // create a variable to hold the collider that was hit
   if (Physics.Raycast(origin, direction, hit)) {
      //print (hit.transform.name);
      return hit.distance;
   }
   else return 1000.0; // didn't hit anything, so assign a large number 
}

