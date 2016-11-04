
//~ function OnMouseDown () {
	//~ if(animation.isPlaying) return;
   //~ CloseDrawer();
//~ }

//~ function CloseDrawer() {
   //~ animation.Play();
   //~ yield new WaitForSeconds(1.75);
   //~ audio.Play();
   //~ GameObject.Find("Point Light FX").animation.Play();
   //~ GameObject.Find("MazeWalls").SendMessage("ResetMaze");// reset the maze	
//~ }


function DoTheJob() {
	
   animation.Play();
   yield new WaitForSeconds(1.75);
   GameObject.Find("Point Light FX").animation.Play();
   audio.Play();
   GameObject.Find("MazeWalls").SendMessage("ResetMaze");// reset the maze	
}
