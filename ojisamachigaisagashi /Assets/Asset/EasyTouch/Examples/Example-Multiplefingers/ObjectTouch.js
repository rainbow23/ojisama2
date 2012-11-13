
private var cam:Camera;
private var deltaPosition:Vector3;

function Start(){

	cam = GameObject.FindGameObjectWithTag("MainCamera").camera;
	
}

function FixedUpdate(){

	var screenPos:Vector2 = cam.WorldToScreenPoint( rigidbody.position);
	
	if ( screenPos.x> Screen.width ||screenPos.y<0 ||screenPos.y> Screen.height)
		Destroy( gameObject);
		
	if (screenPos.x<transform.localScale.x/2){
		rigidbody.AddForce( rigidbody.velocity *-100);
	}
}



// ****************************************************
// Easy Touch Message
// ****************************************************

function On_TouchStart(){
	rigidbody.constraints  = RigidbodyConstraints.FreezeAll;
}

// Simple Touch message
function On_SimpleTap(gesture:Gesture){

	var child:GameObject;
	
	rigidbody.constraints  = RigidbodyConstraints.None;
	
	for (var childreen:Transform in transform ){
		if (childreen.name=="ring")
			child = childreen.gameObject;
	}
	
	if (!child){
		var ring:GameObject;

		ring = Instantiate(Resources.Load("Ring01"), transform.position , Quaternion.identity) as GameObject;
		ring.transform.localScale = transform.localScale * 1.5;
		ring.AddComponent("SlowRotate");
		ring.renderer.material.SetColor ("_TintColor", renderer.material.GetColor("_TintColor"));
		
		ring.transform.parent = transform;
		ring.name="ring";
	
	}
	else{
		Destroy( child);
	}
	
	
	
}

// Long Touch message
function On_LongTap(gesture:Gesture){

	var child:GameObject;
	
	rigidbody.constraints  = RigidbodyConstraints.None;
	
	for (var childreen:Transform in transform){
		if (childreen.name=="ring")
			child = childreen.gameObject;
	}
	
	if (child){
		(child.GetComponent("SlowRotate") as SlowRotate).rotateSpeed *= 1.1;
	}
	
}

// Drag_Start
function On_DragStart(gesture:Gesture){

	var position:Vector3 = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,8));
	deltaPosition = position - rigidbody.position;
	
	rigidbody.constraints  = RigidbodyConstraints.None;
}

// Drag Message => move
function On_Drag(gesture:Gesture){

	var position:Vector3;
	
	position = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,8));
	
	rigidbody.position = position - deltaPosition;
	
}

// Drag end => Add force whith the delta position
function On_DragEnd( gesture:Gesture){

	rigidbody.AddForce( gesture.deltaPosition *  gesture.swipeLength/10 );
	
}

// Pinch for size
function On_PinchIn(gesture:Gesture){

	var zoom:float = Time.deltaTime * gesture.deltaPinch;

	var scale:Vector3 = transform.localScale ;
	transform.localScale = Vector3( scale.x - zoom, scale.y -zoom,1);
}

function On_PinchOut(gesture:Gesture){

	var zoom:float = Time.deltaTime * gesture.deltaPinch;

	var scale:Vector3 = transform.localScale ;
	transform.localScale = Vector3( scale.x + zoom, scale.y +zoom,1);
	
}