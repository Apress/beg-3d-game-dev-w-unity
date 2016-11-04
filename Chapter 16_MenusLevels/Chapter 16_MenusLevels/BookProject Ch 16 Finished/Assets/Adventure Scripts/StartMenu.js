var starter : GameObject;
var startSkin : GUISkin; // custom skin for the start menu
var simpleText : GUIStyle; //simple font/style for navigation text 
var hoverOver : GUIStyle; // override for manual mouseover on label


// misc menu text
private var introText = "Welcome to the Mystery of Tizzleblat...\n a simple world with a solvable problem.";



private var infoText = "Interactive objects- cursor changes color on mouseover, click to activate-objects can be combined in scene or in inventory\nInventory- i key or pick on icon at lower left to access\nMenu access, F1 or mouseover upper left corner of view ";
private var storyText = "Deep in the tropical forest of the equatorial realm, an ancient temple sits. It is said the priests of the early days hid a golden topi fruit against times of need. Should the tree of life failed it contains the seed to re-grow the precious tree. That time is now...";
private var navText = "UP/Down, W/S to move forward/Backward\nA/D to strafe left and right\nLeft and Right arrow keys to turn/look around,\nor <shift> or right mouse button and move mouse to turn and look around";
private var show = 1; //flag for which text to show- 1= story, 2 = info, 3 = navigation

private var groupWidth = 300;  // width of the group
private var buttnRect  = Rect (0,0,140,50); // default button size, x,y location, width and height


function Update () {
}

function OnGUI () {

GUI.skin = startSkin;

	   //alternate text here
	//Game Intructions
	if (show == 2) GUI.Label( Rect (Screen.width / 2 - 390 ,218,160,60), "Instructions",hoverOver);
	else GUI.Label( Rect (Screen.width / 2 - 390 ,218,160,60), "Instructions");

	//Game Navigation
	if (show == 3) GUI.Label( Rect (Screen.width / 2 +215,218,160,60), "Navigation",hoverOver);
	else GUI.Label( Rect (Screen.width / 2 +215,218,160,60), "Navigation");


   // Make a group on the center of the screen
   GUI.BeginGroup (Rect (Screen.width / 2 - 150, Screen.height  / 2 - 210,340, 500)); 
   // all rectangles are now adjusted to the group
   // (0,0) is the top left corner of the group


   // make a box so we can see where the group is on-screen.
   //GUI.Box (Rect (0,60,300,350), "");

  // control elements
   //this is a local variable that gets changed after each button is added
  buttnRectTemp = Rect (groupWidth/2 - buttnRect .width/2 ,40,buttnRect .width,buttnRect .height);

   //Game Intro
   GUI.Label( Rect (0,40,320,100), introText);
   
     //background story
   if(show == 1) GUI.Label( Rect (15,130,280,140), storyText,simpleText);

   //Navigation Instructions
   if (show == 2) GUI.Label( Rect (15,130,280,140), infoText,simpleText);

   //Navigation Instructions
   if (show == 3) GUI.Label( Rect (15,130,280,140), navText,simpleText);
   
     //Content goes here
   // start the buttons down a bit to avoid overlapping
   buttnRectTemp.y += 200; 

   if (GUI.Button (buttnRectTemp, "New Game")) {
      // Start the Main Level
       Application.LoadLevel("MainLevel");
   }

   // move the next control down a bit to avoid overlapping
   buttnRectTemp.y += 50; 

if (GUI.Button (buttnRectTemp, "Load Game")) {
     // load the previous game
        starter.SendMessage("ProcessLoad"); // start the loading process
        Application.LoadLevel("MainLevel");
   }

   // move the next control down a bit to avoid overlapping
   buttnRectTemp.y += 50; 

   if (GUI.Button (buttnRectTemp, "Quit")) {
       // turn off the game
      Application.Quit();
   }










   // End the main menu group we started above. This is very important to remember!
   GUI.EndGroup ();

} // end the OnGui function

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
