
var lightMaterial : Material; // standing stone material for light
var tree : GameObject; // the tree

function ExtraTasks () {

   // hide trunk topi
   GameObject.Find("Topi Fruit Trunk").active = false;

   // hide blasted trunk
   GameObject.Find("Trunk Blasted").active = false;

   // turn on tree
   tree.active = true;
   tree.GetComponent(Interactor).SendMessage("ProcessObject",1);

   //Change the material on the Standing Stones' element 0 material
   GameObject.Find ("Standing Stones").renderer.materials[1] = lightMaterial;

   //Play the voice audio message
   tree.audio.Play();

}
