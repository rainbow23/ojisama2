#pragma strict
private var textMesh:TextMesh;

function Start(){
	
	textMesh = transform.Find("TexttouchStart").transform.gameObject.GetComponent("TextMesh") as TextMesh;
}


function On_TouchStart( gesture:Gesture){
	
	gameObject.renderer.material.color = Color( Random.Range(0.0,1.0),  Random.Range(0.0,1.0), Random.Range(0.0,1.0));
}

function On_TouchDown(gesture:Gesture){
	textMesh.text = "Down since :" + gesture.actionTime.ToString("f2");
}

function On_TouchUp( gesture:Gesture){
	
	gameObject.renderer.material.color = Color( 1,1,1);
	textMesh.text ="Touch Start/Up";
}