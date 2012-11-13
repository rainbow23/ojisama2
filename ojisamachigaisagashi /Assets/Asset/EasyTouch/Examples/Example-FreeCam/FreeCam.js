#pragma strict

private var rotationX:float;
private var rotationY:float;

function On_TouchDown(gesture:Gesture){

	if (gesture.touchCount==2){
		transform.Translate( Vector3(0,0,1) * Time.deltaTime);
	}
	
	 if (gesture.touchCount==3){
		transform.Translate( Vector3(0,0,-1) * Time.deltaTime);
	}	
}


function On_Swipe( gesture:Gesture){

	rotationX += gesture.deltaPosition.x;
	rotationY += gesture.deltaPosition.y;
		
	transform.localRotation = Quaternion.AngleAxis (rotationX, Vector3.up); 
	
	transform.localRotation *= Quaternion.AngleAxis (rotationY, Vector3.left);
	
}
