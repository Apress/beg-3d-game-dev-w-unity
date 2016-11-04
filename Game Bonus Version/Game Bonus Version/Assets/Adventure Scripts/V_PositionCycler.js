var upRange : float =1.0;
var downRange : float =1.0;
var speed : float = 0.2;

private var yPos : float;
private var upPos : float;
private var downPos : float;

var rotate = false; // rotation option
var degrees = 30; // rotation degrees per second

function Start () {

   yPos = transform.position.y;

}

function FixedUpdate () {

   upPos = yPos +upRange;
   downPos = yPos - downRange;
   var weight = Mathf.Cos((Time.time) * speed * 2 * Mathf.PI) * 0.5 + 0.5;
   transform.position.y = upPos * weight        + downPos * (1-weight);

	if (rotate) transform.Rotate(0, degrees * Time.deltaTime, 0);

}
