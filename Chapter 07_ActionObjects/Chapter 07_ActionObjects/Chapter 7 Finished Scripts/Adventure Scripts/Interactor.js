// Pick and Mouseover Info
var triggerDistance : float = 7.0; // distance the camera must be to the object before mouse over

// Gain access to these objects 
var gamePointer : GameObject;  
private var cam : GameObject;
var controlCenter : GameObject;

//Misc vars
private var originalMaterial : Material;
private var aoTexture : Texture;
private var mouseOverMaterial : Material;
private var useTexture : boolean;
var overrideMaterial : Material;
private var useMOCursorChange : boolean;
private var useMOMaterialChange : boolean;


function Start () {

	// search the scene for an object named “main Camera” and assign it to the variable cam
	cam = GameObject.Find("Main Camera");
	
	controlCenter = GameObject.Find("Control Center");
	mouseOverMaterial = controlCenter.GetComponent(GameManager).mouseOverMaterial;

	
	originalMaterial = GetComponent(MeshRenderer).material; // load the material into var
	if (originalMaterial.mainTexture) { // if a texture exists, do…
	   useTexture = true;
	   aoTexture =  originalMaterial.mainTexture;
	   //print (name + ":  "  + aoTexture.name);
	}
	else useTexture = false;
	
	useMOCursorChange = controlCenter.GetComponent(GameManager).useMOCursorChange;

	useMOMaterialChange = controlCenter.GetComponent(GameManager).useMOMaterialChange;


}


function OnMouseEnter () {

	// if navigating [is true], exit the function now
	if (controlCenter.GetComponent(GameManager).navigating) return;

	//print (DistanceFromCamera());

	if (DistanceFromCamera() > triggerDistance) return;

	if (useMOCursorChange) gamePointer.SendMessage("CursorColorChange", true); // turn the pointer back to white 

	if (useMOMaterialChange) {
	
	   if (overrideMaterial) mouseOverMaterial = overrideMaterial;

	   else {
	   
		  if (useTexture) mouseOverMaterial.mainTexture = aoTexture;

		  else mouseOverMaterial.mainTexture = null;
	   
	   }

		renderer.material = mouseOverMaterial; // swap the material
	}
}


function OnMouseExit () {

    if (useMOCursorChange) gamePointer.SendMessage("CursorColorChange", false); // turn the pointer white
	renderer.material = originalMaterial;

}

function DistanceFromCamera () {

   // get the direction the camera is heading so you only process stuff in the line of sight
   var heading : Vector3 = transform.position - cam.transform.position;
   //calculate the distance from the camera to the object 
   var distance : float = Vector3.Dot(heading, cam.transform.forward);
   return distance;
}
