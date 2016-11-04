var cavernPosY : float; //starting position of cavern


function Awake () {

  cavernPosY = transform.position.y; // save original cavern y position 
}

function Start () {

   transform.position.y = cavernPosY - 100; // drop the cavern 100 units
 
}