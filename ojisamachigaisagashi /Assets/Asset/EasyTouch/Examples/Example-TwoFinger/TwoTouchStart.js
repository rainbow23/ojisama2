#pragma strict
private var textMesh:TextMesh;

function Start(){	
	textMesh = transform.Find("TexttouchStart").transform.gameObject.GetComponent("TextMesh") as TextMesh;
}


function On_TouchStart2Fingers( gesture:Gesture){
	gameObject.renderer.material.color = Color( Random.Range(0.0,1.0),  Random.Range(0.0,1.0), Random.Range(0.0,1.0));
}

function On_TouchDown2Fingers(gesture:Gesture){
	textMesh.text = "Down since :" + gesture.actionTime.ToString("f2");
}

function On_TouchUp2Fingers( gesture:Gesture){
	gameObject.renderer.material.color = Color( 1,1,1);
	textMesh.text ="Touch Start/Up";
}

function On_Cancel2Fingers(gesture:Gesture){
	gameObject.renderer.material.color = Color( 1,1,1);
	textMesh.text ="Touch Start/Up";
}