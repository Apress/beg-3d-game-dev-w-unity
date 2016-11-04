var showThis: int; // flag for menu display
var menuObject : GameObject;


function OnMouseEnter () {

   menuObject.GetComponent("StartMenu").show = showThis;
   menuObject.GetComponent(AudioSource).Play();

}

function OnMouseExit () {

   menuObject.GetComponent("StartMenu").show = 1;

}
