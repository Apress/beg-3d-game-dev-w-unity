private var rotAngles = new Array (0,90,90,180,180,270,270);


function Scramble () {
   // get a random element number in the array's range
   var element = Random.Range(0, 6); //remember arrays start at element 0
   //rotate the object on its local Z the number of degrees represented by that element
   transform.localEulerAngles.z = rotAngles[element];
}
