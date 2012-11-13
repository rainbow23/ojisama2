#pragma strict

private var textMesh:TextMesh;
private var trail:GameObject;
private var cam:Camera;

function Start(){
	cam = GameObject.FindGameObjectWithTag("MainCamera").camera;
	textMesh = GameObject.Find("LastSwipe").transform.gameObject.GetComponent("TextMesh") as TextMesh;
}

function On_SwipeStart2Fingers( gesture:Gesture){

	if ( !trail){ // Only the first finger
		var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,5));
		trail = Instantiate( Resources.Load("Trail"),position,Quaternion.identity) as GameObject;
		
		// For real swipe End
		EasyTouch.SetEnableTwist( false);
		EasyTouch.SetEnablePinch( false);
	}
}

function On_Swipe2Fingers( gesture:Gesture){
	
	if (trail){
		var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,5));
		trail.transform.position = position;
	}
}

function On_SwipeEnd2Fingers( gesture:Gesture){
	if (trail){
		Destroy(trail);
		var angles:float = Mathf.Atan2( gesture.swipeVector.normalized.y,gesture.swipeVector.normalized.x) * Mathf.Rad2Deg;
		textMesh.text = "Last swipe : " + gesture.swipe.ToString() + " /  vector : " + gesture.swipeVector.normalized + " / angle : " + angles.ToString("f2");
		EasyTouch.SetEnableTwist( true);
		EasyTouch.SetEnablePinch( true);	
			
	}
}


function On_Cancel2Finger( gesture:Gesture){

	if (trail){
		Destroy(trail);
		textMesh.text = "Last swipe : cancel";
		EasyTouch.SetEnableTwist( true);
		EasyTouch.SetEnablePinch( true);		
	}
}