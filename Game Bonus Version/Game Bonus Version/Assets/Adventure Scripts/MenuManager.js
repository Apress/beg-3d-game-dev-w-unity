var menuSkin : GUISkin; // custom skin for the menus
var simpleText : GUIStyle; // text for nav and info

private var groupWidth = 300;  // width of the group
private var buttnRect = Rect (0,140,150,30); // default button size, x,y location, width and height

private var miniMenu = false; // flag to turn menu off and on
private var mainMenu = false; // flag for main menu
private var settingsMenu = false; // flag for settings
private var confirmDialog = false; // flag for yes/no on quit dialog
private var creditsScreen = false; // flag for credits menu
private var menuMode = false; // no menus are open
private var iMode = false; // track inventory mode
private var saving = false; // flag for message for save function

// misc menu text
private var introText = "Welcome to the Mystery of Tizzleblat...\n a simple world with a solvable problem.";
private var infoText = "Interactive objects- cursor changes color on \nmouse over, click to activate\nInventory- i key or pick on icon at lower left to \naccess\nGeneral- objects can be combined in scene or \nin inventory";
private var navText = "Navigation:\nUP/Down, W/S to move forward/Backward\n A/D to strafe left and right\nLeft and Right arrow keys to turn/look around, or <shift> \nor right mouse button + move mouse to turn/look around\nSpacebar to jump";
private var credits = "Story : Sue Blackman\nLevel Design: Sue Blackman\nJenny Wang,Gabriel Acosta\nStart Screen Design: Jenny Wang\nMusic: Bryan Taylor\nArt assets and animation: Sue Blackman\nScripting: Sue Blackman\nAuxilliary Scripting: Sean MacCurry\n\nMade with: Unity3D, 3DS Max\n\nBuy the Book!\nBeggining 3D Game Development with Unity 3D\nBy: Sue Blackman\nApress, publishers";
//Settings menu variables
private var walkSpeed : float; // element 0
private var turnSpeed : float; // element 1
private var useText : boolean = true; // element 2
private var objectDescriptions : boolean; // element 3
private var fXVolume : float; // element 4
private var ambVolume : float; // element 5
private var musicVolume : float; // element 6
private var voiceVolume : float; // element 7
private var useMOCursor : boolean; // element 8
private var cursorColorChange : float; // element 9

private var playerSettings  = new Array (); // player settings array

// color bar variables
var colorBar : GUIStyle; // color picker slider
var pickerThumb : GUIStyle; // color picker slider
var colorSwatch : Texture;
var moColor : Color; // mouseover color

//Gain access to 
private var controlCenter : GameObject;
private var fPCamera : GameObject;
private var fPController: GameObject;

 //background handling
var menuCameras : Camera[];
var menuBackgrounds : Texture[];
var backgroundImage : GameObject;

private var menuCamera = 0; // the Camera for the current menu
private var menuBackground : int; // the current  background texture
private var overRide = false; // emergency override if cam change is bad idea

// Menu background assignments, 0= default cam, 100 = default texture
// numbers less than 100 are cameras, more than 100 are texture (element + 100)
private var mainMenuBG = Array(0,1,100);
private var settingsMenuBG = Array (0,2,100);
private var creditsMenuBG = Array (0,101,0);

private var level = 0; // will tell us which element to use

//moving menu
private var rollCredits = false;
private var vPos =  0.0;
private var base = 1000.0; 
private var end = false;  //end sequence 



function Start () {

   controlCenter  = GameObject.Find("Control Center");
   
   LoadPlayerSettings(); // load the player settings values
   
   fPCamera= GameObject.Find("Main Camera");
   fPController  = GameObject.Find("First Person Controller");
	backgroundImage.guiTexture.enabled = false; // turn off the background texture
	level = Application.loadedLevel; // get the current level's id
	base = Time.time;
 
}


function Update () {

	if (iMode) return; // the inventory screen is open

	//toggle the minimenu off and on
	if (Input.GetKeyDown("f1") && !menuMode) {
		if(miniMenu) {
			miniMenu = false;
			MenuMode(false);
		}
		 else if (!menuMode ) { // if no other menus are open, open it
			miniMenu = true;
			MenuMode(true);
		 }
	}

	
	// brings up the yes/no menu when the player hits the escape key to quit
	 if (Input.GetKey ("escape")&& !menuMode) {
		 if (end) Application.Quit();
		 confirmDialog = true; // flag to bring up yes/no menu
		 MenuMode(true); 
	}

	var pos = Input.mousePosition; //get the location of the cursor
	if (pos.y > Screen.height - 5.0  && pos.x <  5.0 && !menuMode) { 
		miniMenu = true;
		MenuMode(true);
	}

	if(creditsScreen && Input.anyKeyDown) {
	   creditsScreen = false;
	   MenuMode(false);
	}


}


function OnGUI () {

	if (iMode) return; // the inventory screen is open

	GUI.skin = menuSkin; 

    // ************** Roll Credits  *******************

	if (rollCredits) {

	   //Make a group on the center of the screen
	   GUI.BeginGroup(Rect (Screen.width / 2 - 200, vPos, 600, 600));

	   GUI.Box (Rect (0,20,400,500), "The End");

	   GUI.Label( Rect (100,20,200,100), "Credits");
	   GUI.Label( Rect (20,0,360,600), credits);	   

	   // add labels here 

	   GUI.EndGroup ();
	   
		// update the credits menu position if time is not up 
		vPos =  Mathf.SmoothStep(700.0, 100.0, (Time.time - base)  *  0.05);  

 
	}// end roll credits



   // *****  mini menu  ******
   if(miniMenu && !end) {

      // Make a group on the center of the screen
      GUI.BeginGroup (Rect (Screen.width / 2 - 150, Screen.height / 2 - 160, 300, 280));
      // all rectangles are now adjusted to the group
      // (0,0) is the top left corner of the group

      // make a box so we can see where the group is on-screen.
      GUI.Box (Rect (25,0,250,280), "Options");


      // control elements
	//this is a local variable that gets changed after each button is added
	var buttnRectTemp = Rect (groupWidth/2 - buttnRect.width/2,50,buttnRect.width,buttnRect.height);

   if (GUI.Button (buttnRectTemp, "Main Menu")) {
      // go to main menu
      miniMenu = false;
	  Background(mainMenuBG[level]); // custom background
      mainMenu= true;
   }

   // move the next control down a bit to avoid overlapping
   buttnRectTemp.y += 40; 

   if (GUI.Button (buttnRectTemp, "Settings")) {
      // go to settings menu
      miniMenu = false;
	  Background(mainMenuBG[level]); // custom background
      settingsMenu = true;
   }

   // move the next control down a bit to avoid overlapping
   buttnRectTemp.y += 40; 

   if (GUI.Button (buttnRectTemp, "Save")) {
      // save the current game
      miniMenu = false;
	  MenuMode(false);
      SaveGame(true);
   }

   // move the next control down a bit to avoid overlapping
   buttnRectTemp.y += 40; 


   if (GUI.Button (buttnRectTemp, "Resume")) {
      // turn off the menu
      miniMenu = false;
	  MenuMode(false);
   }

   // move the next control down a bit to avoid overlapping
   buttnRectTemp.y += 40; 

   if (GUI.Button (buttnRectTemp, "Quit")) {
      // turn off the menu
      miniMenu = false;
     //set flag for yes/no pop-up
      confirmDialog = true;
	  MenuMode(true); 
    }


      // End the group we started above. This is very important to remember!
      GUI.EndGroup ();

  } // end the minimenu if
  
  
   // *******   confirmDialog dialog  *******
   if (confirmDialog) {

   // Make a group on the center of the screen
   GUI.BeginGroup (Rect (Screen.width / 2 - 100, Screen.height / 2 - 75, 200, 150));

   // make a box so we can see where the group is on-screen.
   GUI.Box (Rect (0,0,200,380), "Do you really want to quit?");

   // reset the  buttnRectTemp.y value
   buttnRectTemp = Rect (25,30,150,buttnRect .height);

   if (GUI.Button (buttnRectTemp, "No, resume game")) {
      // turn off the menu
      confirmDialog = false;
	  MenuMode(false);
   }

   buttnRectTemp.y += 40;

   if (GUI.Button (buttnRectTemp, " Yes, quit without saving")) {
      // quit the game without saving
      confirmDialog = false;
	  MenuMode(false);
      print ("closing");
      Application.Quit();
   }


   buttnRectTemp.y += 40;

   if (GUI.Button (buttnRectTemp, " Yes, but Save first")) {
      // turn off the menu, save the game, then quit
      confirmDialog = false;
	  MenuMode(false);
      SaveGame(true); // quit after saving 
   }

     // End the confirmDialog group we started above. This is very important to remember!
     GUI.EndGroup ();

   } // end confirm
  
	// ********  main menu  *************
	 if(mainMenu) {

	// Make a group on the center of the screen
	GUI.BeginGroup (Rect (Screen.width / 2 - 175 , Screen.height  / 2 - 250, 350, 500)); 
	 // all rectangles are now adjusted to the group
	// (0,0) is the top left corner of the group

	// control elements

	// make a box so we can see where the group is on-screen.
	GUI.Box (Rect (0,0,350,110), "Main Menu");

	// make a box so we can see where the group is on-screen.
	GUI.Box (Rect (0,120,350,215), "General Information and Navigation");

	// make a box so we can see where the group is on-screen.
	GUI.Box (Rect (0,345,350,150), "");

	//this is a local variable that gets changed after each button is added
	buttnRectTemp = Rect (groupWidth/2 - buttnRect.width +30,50,buttnRect.width-10,buttnRect.height);

	//Game Intro
	GUI.Label( Rect (30,20,250,100), introText);

	//General Info
	GUI.Label( Rect (10,150,350,120), infoText,simpleText);

	//Navigation Instructions
	GUI.Label( Rect (10,240,350,350), navText,simpleText);

	// start the buttons down a bit to avoid overlapping
	buttnRectTemp.y += 315; 

	if (GUI.Button (buttnRectTemp, "New Game")) {
		// Start the Main Level
		Application.LoadLevel("MainLevel");
	}

	buttnRectTemp.x = groupWidth/2 +30;

	if (GUI.Button (buttnRectTemp, "Settings")) {
	   // go to settings menu
	   mainMenu = false;
	   Background(settingsMenuBG[level]); // custom background
	   settingsMenu = true;
	}

	// move the next control down a bit to avoid overlapping
	buttnRectTemp.y += 40; 
	buttnRectTemp.x = groupWidth/2 - buttnRect .width +30;

	if (GUI.Button (buttnRectTemp, "Load Game")) {
	   // load the previous game
	   mainMenu = false;
	   LoadGame();
	   MenuMode(false); 
	}

	buttnRectTemp.x = groupWidth/2 +30;

	 if (GUI.Button (buttnRectTemp, "Credits")) {
	 // go to settings menu
		mainMenu = false;
		Background(creditsMenuBG[level]); // custom background
		creditsScreen = true;
	}

	// move the next control down a bit to avoid overlapping
	buttnRectTemp.y += 40; 
	buttnRectTemp.x = groupWidth/2 - buttnRect .width /2 + 30;

	if (GUI.Button (buttnRectTemp, "Resume")) {
	   // turn off the menu
	   mainMenu = false;
	   MenuMode(false); 
	}


	 // End the main menu group we started above. This is very important to remember!
	 GUI.EndGroup ();

	} // end the main menu conditional


	// ********  credits screen  *************
	if(creditsScreen) {

	   // Make a group on the center of the screen
	   GUI.BeginGroup (Rect (Screen.width / 2 - 150 , Screen.height  / 2 - 250, 300, 500)); 
	   // all rectangles are now adjusted to the group
	   // (0,0) is the top left corner of the group

	   // make a box so we can see where the group is on-screen.
	   GUI.Box (Rect (0,0,300,500), "Credits");

	   // move the next control down a bit to avoid overlapping
	   buttnRectTemp.y += 40;

	   // add labels here
	   GUI.Label( Rect (20,00,250,500), credits);

	   // End the main menu group we started above. This is very important to remember!
	   GUI.EndGroup ();

	} // end the credits screen conditional

	//******* Settings menu  ********
	if (settingsMenu) Settings(); // let the setting function process all of its own content

   // saving message
   if (saving) GUI.Label( Rect (20,20,250,100), "Saving game");


} // end the OnGui function



function SaveGame (quitAfter : boolean) {

   //print ("saving");
   GameObject.Find("SystemIO").SendMessage( "WriteFile", "MyNewSavedGame");
   saving = true;
   yield new WaitForSeconds(2);
   saving = false;


   if (quitAfter) Application.Quit();

   //print ("closing");

}


function MenuMode (state : boolean) {

   if (state) { // go into menuMode
   menuMode = true;
   // handle other cameras
	GameObject.Find("Camera Pointer").GetComponent(Camera).enabled = false;
	if (level == 1) GameObject.Find("Camera MazeView").GetComponent(Camera).enabled = false;

	fPController.GetComponent(CharacterMotor).enabled = false; // turn off navigation
	fPController.GetComponent(FPAdventurerInputController).enabled = false; // turn off navigation
	fPController.GetComponent(MouseLookRestricted).enabled = false; // turn off navigation
	fPCamera.GetComponent(MouseLookRestricted).enabled = false;


   }

   else { // return from menuMode
   menuMode = false;

	Background(-1); // turn off the background
	fPController.GetComponent(CharacterMotor).enabled = true; // turn on navigation
	fPController.GetComponent(FPAdventurerInputController).enabled = true; // turn on navigation
	fPController.GetComponent(MouseLookRestricted).enabled = true; // turn on navigation
	fPCamera.GetComponent(MouseLookRestricted).enabled = true;
    yield new WaitForSeconds(2);
    GameObject.Find("Camera Pointer").GetComponent(Camera).enabled = true;
   }
   
}

function LoadGame () {

   GameObject.Find("SystemIO").SendMessage( "ReadFile", "SavedGame");


}
 
function Settings () {

   // Make a group on the center of the screen for  the settings menu
   GUI.BeginGroup (Rect (Screen.width / 2 - 300 , Screen.height  / 2 - 250, 600, 500)); 
   // all rectangles are now adjusted to the group


   //****  guts group   *****
   GUI.BeginGroup (Rect (0,10, 600, 500)); 

   // navigation 
   var navBox = Rect (10,20,580,80);
   GUI.Box (navBox, "Navigation");
	GUI.Label (Rect (25, 35, 100, 30), "Walk Speed");
	walkSpeed = GUI.HorizontalSlider (Rect (150, 40, 100, 20), walkSpeed, 0.0, 20.0);
	GUI.Label (Rect (25, 60, 100, 30), "Turn Speed");
	turnSpeed = GUI.HorizontalSlider (Rect (150,65, 100, 20), turnSpeed, 0.0, 40.0);




   // text 
   var textBox = Rect (300,270,290,150);
   GUI.Box (textBox, "Text");
	useText = GUI.Toggle (Rect (320, 300, 120, 30), useText, "Use Text");
	objectDescriptions = GUI.Toggle (Rect (320,330, 120, 30), objectDescriptions, "Use Descriptions");




   // audio 
   var audioBox = Rect (10,110,580,150);
   GUI.Box (audioBox, "Audio");
	audioBox.y += 30;
	GUI.Label (Rect (25, audioBox.y, 100, 30), "FX Volume");
	audioBox.y += 10;
	fXVolume = GUI.HorizontalSlider (Rect (150, audioBox.y, 100, 20), fXVolume, 0.0, 1.0);
	audioBox.y += 14;
	GUI.Label (Rect (25, audioBox.y, 100, 30), "Ambient Volume");
	audioBox.y += 10;
	ambVolume = GUI.HorizontalSlider (Rect (150,audioBox.y, 100, 20), ambVolume, 0.0, 1.0);
	audioBox.y += 14;
	GUI.Label (Rect (25, audioBox.y, 100, 30), "Music Volume");
	audioBox.y += 10;
	musicVolume = GUI.HorizontalSlider (Rect (150, audioBox.y, 100, 20), musicVolume, 0.0, 1.0);
	audioBox.y += 14;
	GUI.Label (Rect (25, audioBox.y, 100, 30), "Dialog Volume");
	audioBox.y += 10;
	voiceVolume = GUI.HorizontalSlider (Rect (150,audioBox.y, 100, 20), voiceVolume, 0.0, 1.0);





   // cursor 
   var cursorBox = Rect (10,270,280,150);
   GUI.Box (cursorBox, "Cursor");
	cursorBox.y += 40;
	useMOCursor = GUI.Toggle (Rect (20, cursorBox.y , 180, 30), useMOCursor, "Use Mouseover Color");
	cursorBox.y += 30;
	GUI.Label (Rect (20, cursorBox.y , 120, 30),  "Mouseover Color");
	cursorBox.y += 20;
	cursorColorChange = GUI.HorizontalSlider(Rect (20, cursorBox.y , 200, 40),cursorColorChange,0.0,1536.0,colorBar,pickerThumb);
	
	GUI.contentColor = moColor; 
	GUI.Box (Rect (180, 312 , 40, 40),colorSwatch);
	GUI.contentColor = Color.white;



	// track changes
	if (GUI.changed) {

	UpdateSettings(); // process the changes

	}


   // button 
   var buttonBox = Rect (10,430,580,50);
   GUI.Box (buttonBox, "");
	 if (GUI.Button (Rect (20,440,150,30), "Main Menu")) {
		// turn off the menu
		settingsMenu = false;
		Background(mainMenuBG[level]); // custom background
		mainMenu = true;
	}
	if (GUI.Button (Rect (430,440,150,30), "Resume")) {
		// turn off the menu
		settingsMenu = false;
		MenuMode(false); 
	}




   // End the groups we started above. This is very important to remember!
   GUI.EndGroup ();
   GUI.EndGroup ();

}


function LoadPlayerSettings () {

   //load in the array of current settings for the parameters exposed to the player
   playerSettings = controlCenter.GetComponent(GameManager).playerSettings;

   walkSpeed = playerSettings[0];
   turnSpeed = playerSettings[1]; 
   objectNames = playerSettings[2]; 
   objectDescriptions = playerSettings[3]; 
   fXVolume= playerSettings[4]; 
   ambVolume = playerSettings[5]; 
   musicVolume = playerSettings[6]; 
   voiceVolume = playerSettings[7]; 
   useMOCursor = playerSettings[8]; 
   //cursorColorChange
	moColor = playerSettings[9]; // the rgb color
	cursorColorChange = playerSettings[10]; 

}


function UpdateSettings() {

   playerSettings[0] = walkSpeed;
   playerSettings[1] = turnSpeed; 
   playerSettings[2] = useText; 
   playerSettings[3] = objectDescriptions; 
   playerSettings[4] = fXVolume; 
   playerSettings[5] = ambVolume; 
   playerSettings[6] = musicVolume; 
   playerSettings[7] = voiceVolume; 
   playerSettings[8] = useMOCursor; 
   // cursorColorChange 
   ProcessHue(cursorColorChange); // convert Hue/slider value to rgb
   playerSettings[9] =  moColor;
   playerSettings[10] = cursorColorChange; // send back the slider value


   // send the updated settings off to the GameManager
   controlCenter.SendMessage("NewSettings", playerSettings);
   
	//Update Audio volumes
	var gos = GameObject.FindGameObjectsWithTag ("ActionObject");
	for (var go in gos) {
		print(go.name); // use until we get no errors
	   go.GetComponent(Interactor).soundFXVolume = fXVolume;
	//check for audio source & update Voice if found
	if (go.GetComponent(AudioSource)) go.GetComponent(AudioSource).volume = voiceVolume;
	}
	gos = GameObject.FindGameObjectsWithTag ("Ambient");
	for (go in gos) go.GetComponent(AudioSource).volume = ambVolume;
	
	gos = GameObject.FindGameObjectsWithTag ("Music");
	for (go in gos) go.GetComponent(AudioSource).volume = musicVolume;
	
	gos = GameObject.FindGameObjectsWithTag ("FX");
	for (go in gos) go.GetComponent(AudioSource).volume = fXVolume;
	gos = GameObject.FindGameObjectsWithTag ("Voice");
	for (go in gos) go.GetComponent(AudioSource).volume = voiceVolume;




}


function ProcessHue (value :float) {

   var zone = parseInt(value / 256);
   var mod = parseInt(value % 256);

   //print (value + "  " + zone + "  " + mod);

   var r : int;
   var g : int;
   var b : int;

   switch (zone) {

   case 0 :
        //red
        r = 255;
        g = 0;
        b = 0 + mod;
        break;

   case 1 :
        //magenta
        r = 255 - mod;
        g = 0;
        b = 255;
        break;

   case 2 :
        //blue
        r = 0;
        g = 0 + mod;
        b = 255;
        break;

   case 3 :
        //cyan
        r = 0;
        g = 255;
        b = 255 - mod;
        break;

   case 4 :
        //green
        r = 0 + mod;
        g = 255;
        b = 0;
        break;

   case 5 :
        //yellow
        r = 255;
        g = 255 - mod;
        b = 0;
        break;

   case 6 :
        //red
        r = 255;
        g = 0;
        b = 0;
        break;

   }

   //change fractions to decimal & assign to the variable
   moColor = Color(r/255.0,g/255.0,b/255.0);


}

function Background (newBG : int) {

  //menu mode is finished
  if (newBG == -1) { 
      //turn off current camera unless it was 0, the main camera if it one was on
      if (menuCamera > 0) menuCameras[menuCamera].enabled = false;
      backgroundImage.guiTexture.enabled = false; // turn off the background texture
  }

//emergency override of cameras
  if (overRide) {
      menuBackground = 0;
      return;
  }

  // is a 3D background
  if (newBG >= 0 && newBG <100) {
     //turn off current camera unless it was 0, the main camera if it one was on
     if (menuCamera > 0) menuCameras[menuCamera].enabled = false;
     backgroundImage.guiTexture.enabled = false; // turn off the texture
     //turn on new camera
     menuCameras[newBG].enabled = true;
     menuCamera = newBG; // assign the new camera number
  }

  //is a 2D background
  if (newBG > 99) {
     //turn off current camera unless it was 0, the main camera if it one was on
     if (menuCamera > 0) menuCameras[menuCamera].enabled = false;
   // assign the texture using the true element number and activate the background
   menuBackground = newBG; 
   backgroundImage.guiTexture.texture = menuBackgrounds[menuBackground-100];
   backgroundImage.guiTexture.enabled = true;
  }

}// end background function
