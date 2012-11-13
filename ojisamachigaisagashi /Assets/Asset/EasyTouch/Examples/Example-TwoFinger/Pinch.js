#pragma strict
private var textMesh:TextMesh;

function Start(){
	textMesh = transform.Find("TextPinch").transform.gameObject.GetComponent("TextMesh") as TextMesh;
}

function On_TouchStart2Fingers( gesture:Gesture){
	
	// disable twist gesture recognize for a real pinch end
	EasyTouch.SetEnableTwist( false);
	EasyTouch.SetEnablePinch( true);
}

function On_PinchIn(gesture:Gesture){

	var zoom:float = Time.deltaTime * gesture.deltaPinch;

	var scale:Vector3 = transform.localScale ;
	transform.localScale = Vector3( scale.x - zoom, scale.y -zoom, scale.z-zoom);
	
	textMesh.text = "Delta pinch : " + gesture.deltaPinch.ToString();
}

function On_PinchOut(gesture:Gesture){

	var zoom:float = Time.deltaTime * gesture.deltaPinch;

	var scale:Vector3 = transform.localScale ;
	transform.localScale = Vector3( scale.x + zoom, scale.y +zoom,scale.z+zoom);
	
	textMesh.text = "Delta pinch : " + gesture.deltaPinch.ToString();
}

function On_PinchEnd(gesture:Gesture){
	transform.localScale =Vector3(1.7,1.7,1.7);
	EasyTouch.SetEnableTwist( true);
	textMesh.text="Pinch me";
	
}

function On_Cancel2Fingers(gesture:Gesture){
	transform.localScale =Vector3(1.7,1.7,1.7);
	EasyTouch.SetEnableTwist( true);
	textMesh.text="Pinch me";
}