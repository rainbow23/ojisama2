#pragma strict

private var textMesh:TextMesh;

function Start(){
	textMesh = transform.Find("TextTwist").transform.gameObject.GetComponent("TextMesh") as TextMesh;
}

function On_TouchStart2Fingers( gesture:Gesture){
	
	EasyTouch.SetEnablePinch( false);
	EasyTouch.SetEnableTwist( true);
}

function On_Twist( gesture:Gesture){

	transform.Rotate(Vector3(0,0,gesture.twistAngle));
	textMesh.text = "Delta angle : " + gesture.twistAngle.ToString();
}

function On_TwistEnd( gesture:Gesture){

	EasyTouch.SetEnablePinch( true);
	transform.rotation = Quaternion.identity;
	textMesh.text ="Twist me";
}

function On_Cancel2Fingers(gesture:Gesture){
	EasyTouch.SetEnablePinch( true);
	transform.rotation = Quaternion.identity;
	textMesh.text ="Twist me";
}