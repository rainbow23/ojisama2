#pragma strict

private var textMesh:TextMesh;
private var deltaPosition:Vector3;
private var cam:Camera;

function Start(){
	cam = GameObject.FindGameObjectWithTag("MainCamera").camera;
	textMesh = transform.Find("TextDrag").transform.gameObject.GetComponent("TextMesh") as TextMesh;
}

function On_DragStart( gesture:Gesture){
	
	gameObject.renderer.material.color = Color( Random.Range(0.0,1.0),  Random.Range(0.0,1.0), Random.Range(0.0,1.0));

	var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,5));
	deltaPosition = position - transform.position;
		
}


function On_Drag(gesture:Gesture){

	var position:Vector3;
	
	position = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,5));
	
	transform.position = position - deltaPosition;
	
	var angles:float = Mathf.Atan2( gesture.swipeVector.normalized.y,gesture.swipeVector.normalized.x) * Mathf.Rad2Deg;
	
	textMesh.text = gesture.swipe.ToString() + " / angle :" + angles.ToString("f2");
}

function On_DragEnd(gesture:Gesture){

	transform.position=Vector3(3,1.8,-5);
	gameObject.renderer.material.color = Color(1,1,1);
	textMesh.text="Drag me";
}