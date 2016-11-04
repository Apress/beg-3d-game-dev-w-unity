

function Awake () {

	DontDestroyOnLoad (transform.gameObject);

}



function ProcessLoad () {

	yield new WaitForSeconds(0.1); //make sure everything is loaded

	GameObject.Find("SystemIO").SendMessage( "ReadFile", "SavedGame");
	
}

