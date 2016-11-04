var timer : float; // light update interval to slow down flicker 
var baseIntensity = 0.4; 
var maxOffset = 0.2;

function Start () {

   timer =  Time.time + 0.15; // update interval

}

function Update () {

   if (Time.time > timer ) {
      light.intensity =  baseIntensity + Random.Range (0.0, maxOffset) ;
      timer = Time.time + 0.15;
   }

}
