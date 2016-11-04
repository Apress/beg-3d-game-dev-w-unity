var fade : GameObject; // fade out prefab


function OnTriggerEnter () {
 
 Instantiate(fade);
 yield new WaitForSeconds(1);

 Application.LoadLevel ("FinalLevel");

}
