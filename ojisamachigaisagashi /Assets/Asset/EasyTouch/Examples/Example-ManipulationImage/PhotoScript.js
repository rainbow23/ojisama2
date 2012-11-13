#pragma strict

private var fullScreen:boolean=false;

private var deltaPosition:Vector3;
private var cam:Camera;

private var rotation:Vector3;

function Start () {

	// Getting the main camera
	cam = GameObject.FindGameObjectWithTag("MainCamera").camera;
	
	
	// All messages are transfered to this gameObject (for pinch & twist)
	EasyTouch.SetOtherReceiverObject( gameObject);
		
}


// One finger drag
function On_DragStart( gesture:Gesture){

 	// restricted when there is only one touch 
 	
	if (gesture.touchCount==1){
		// Calculate the delta position between touch and photo center position
		var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,1));
		deltaPosition = position - transform.position;
	}
}

function On_Drag( gesture:Gesture){

	if (gesture.touchCount==1){
		var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,1));
		transform.position = position - deltaPosition;
	}
}


// when a two finger gesture begining
function On_TouchStart2Fingers(gesture:Gesture){

	// Calculate the delta position between touch and photo center position
	var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,1));
	deltaPosition = position - transform.position;
}

function On_TouchDown2Fingers(gesture:Gesture){

	// Moving during pinch
	var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,1));
	transform.position = position - deltaPosition;
}


// Zoom in and zoom out with pinch
function On_PinchIn(gesture:Gesture){

	var zoom:float = Time.deltaTime * gesture.deltaPinch/25;
	var scale:Vector3 = transform.localScale ;

	if ( scale.x - zoom>0.1)
		transform.localScale = Vector3( scale.x - zoom, scale.y -zoom,1);
	
}

function On_PinchOut(gesture:Gesture){

	var zoom:float = Time.deltaTime * gesture.deltaPinch/25;
	var scale:Vector3 = transform.localScale ;
	
	if ( scale.x + zoom<3 )
		transform.localScale = Vector3( scale.x + zoom, scale.y +zoom,1);

}

// Twist
function On_Twist( gesture:Gesture){

	transform.Rotate(Vector3(0,0,gesture.twistAngle));
}




