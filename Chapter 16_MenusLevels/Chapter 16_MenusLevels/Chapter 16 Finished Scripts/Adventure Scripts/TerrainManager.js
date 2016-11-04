var showTerrain = true; // true means show on enter, false means hide on enter

private var terrain : GameObject;
private var cavern : GameObject;

private var terrainPosY : float;
private var cavernPosY : float;

function Start () {

   terrain = GameObject.Find("Terrain");
   cavern = GameObject.Find("Cavern Group");

   cavernPosY = cavern.GetComponent(CavernPosition).cavernPosY; // get cavern's original position 
   terrainPosY = terrain.transform.position.y ; // get terrain
   
}

 function OnTriggerEnter () {

   if (showTerrain) {
       terrain.transform.position.y = terrainPosY; // restore the terrain
	   cavern.transform.position.y = cavernPosY - 100;  // drop the cavern
	   GameObject.Find("Control Center").GetComponent(MenuManager).overRide = false;
	   this.SendMessage("Switcher", true); // turn on various sounds
   }

   else {
		GameObject.Find("Control Center").GetComponent(MenuManager).overRide = true;
       terrain.transform.position.y = terrainPosY - 100; // drop the terrain
	   cavern.transform.position.y = cavernPosY ;  // restore the cavern
	   this.SendMessage("Switcher", false); // turn off various sounds
   }

}
