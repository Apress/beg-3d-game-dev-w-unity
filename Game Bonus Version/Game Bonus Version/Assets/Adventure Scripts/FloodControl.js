var floodWater :GameObject;

function DoTheJob () {



	floodWater.GetComponent(UVAnimator).enabled = false;
	floodWater.GetComponent(V_PositionCycler).enabled = false;
	yield new WaitForSeconds(0.1);
	new WaitForSeconds(0.1); //let camera match happen
	floodWater.animation.Play("water drop");

}