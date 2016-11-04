// Scroll main texture based on time
var materialIndex : int = 0;

var animateUV = true;
var scrollSpeedU1 = 0.0;
var scrollSpeedV1 = 0.0;


var animateBump = true;
var scrollSpeedU2 = 0.0;
var scrollSpeedV2 = 0.0;

function Start () {

   //print ("shininess " + renderer.materials[materialIndex].HasProperty("_Shininess"));
   //print ("parallax " + renderer.materials[materialIndex].HasProperty("_Parallax"));

}

function FixedUpdate () {

   var offsetU1 = Time.time  * -scrollSpeedU1;
   var offsetV1 = Time.time  * -scrollSpeedV1;

   var offsetU2 = Time.time  * -scrollSpeedU2;
   var offsetV2 = Time.time  * -scrollSpeedV2;

   if (animateUV) {
      renderer.materials[materialIndex].SetTextureOffset ("_MainTex", Vector2(offsetU1,offsetV1));
  }

   if (animateBump) {
      renderer.materials[materialIndex].SetTextureOffset ("_BumpMap", Vector2(offsetU2,offsetV2));
   }

}
