#pragma strict

private var demon:GameObject;
private var controller : CharacterController;
private var moveDirection:Vector3;

function Start () {

	// All easytouch messages are received on this gameObject too
	EasyTouch.SetOtherReceiverObject( gameObject );

	demon = GameObject.Find("demon").gameObject;
	controller = demon.GetComponent(CharacterController) as CharacterController;
}

function Update(){

	if (EasyTouchInput.TouchCount()==0)
		demon.animation.CrossFade ("idle");
	
	if (!controller.isGrounded){
		demon.animation.CrossFade ("jump");
		moveDirection.y -= 5 * Time.deltaTime;
	}

	controller.Move(moveDirection * Time.deltaTime);
	moveDirection = Vector3(0,moveDirection.y,0);
}



function On_TouchDown( gesture:Gesture){
	
	// if something is picked
	if (gesture.pickObject){
		// test the object name Right
		if (gesture.pickObject.name == "Right"){
			demon.transform.localRotation.eulerAngles.y=90;
			moveDirection.x = 0.7;
			demon.animation.CrossFade ("walk");
		}
		// test the object name Lefy
		else if (gesture.pickObject.name == "Left"){
			demon.transform.localRotation.eulerAngles.y=-90;
			moveDirection.x = -0.7;
			demon.animation.CrossFade ("walk");
		}
	}
}

function On_TouchUp(gesture:Gesture){
	// clean up
	moveDirection = Vector3(0,moveDirection.y,0);
}


function On_TouchStart( gesture:Gesture){

	// Jump ?
	if (gesture.pickObject){
		if (controller.isGrounded){
			if (gesture.pickObject.name == "Up"){
				moveDirection.y = 3;
			}
		}	
	}
}