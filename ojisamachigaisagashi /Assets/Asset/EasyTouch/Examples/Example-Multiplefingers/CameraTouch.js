#pragma strict

private var cam:Camera;

function Start(){

	// Getting the main camera
	cam = GameObject.FindGameObjectWithTag("MainCamera").camera;
}

// ****************************************************
// Easy Touch Method
// ****************************************************

// Simple tap message
function On_TouchStart(gesture:Gesture){

	var position:Vector3;
	
	// Transforms 2D coordinate tap position in 3D world position
	position = cam.ScreenToWorldPoint( Vector3( gesture.position.x, gesture.position.y,8));
	
	// ...
	var sphere:GameObject;
	sphere = Instantiate(Resources.Load("GlowDisk01"), position , Quaternion.identity) as GameObject;
	var size:float = Random.Range(0.5,0.8);
	sphere.transform.localScale = Vector3(size,size,size);
	
	var spot:GameObject= Instantiate(Resources.Load("Spot"), position , Quaternion.identity) as GameObject;
	spot.transform.localScale = sphere.transform.localScale/2;
	spot.transform.parent = sphere.transform;
	
	// Random color
	var rndColor:int = Random.Range(1,6);

	var color:Color;
	switch (rndColor){
		case 1:
			color = Color(1, Random.Range(0.0,0.8),Random.Range(0.0,0.8), Random.Range(0.3,0.9));
			break;
		case 2:
			color = Color(Random.Range(0.0,0.8),1,Random.Range(0.0,0.8), Random.Range(0.3,0.9));
			break;
		case 3:
			color = Color(Random.Range(0.0,0.8),1,1, Random.Range(0.3,0.9));
			break;
		case 4:
			color = Color(1,Random.Range(0.0,0.8),1, Random.Range(0.3,0.9));
			break;
		case 5:
			color = Color(1,Random.Range(0.0,0.8),Random.Range(0.0,0.8), Random.Range(0.3,0.9));
			break;
		case 6:
			color = Color(Random.Range(0.0,0.8),Random.Range(0.0,0.8),1, Random.Range(0.3,0.9));
			break;
	
	}     
	sphere.renderer.material.SetColor ("_TintColor", color);
	spot.renderer.material.SetColor ("_TintColor",color);
	
	// assign the layer for auto detection
	sphere.layer=8;
	
	// Add a script to react with the touchs
	sphere.AddComponent("ObjectTouch");
	
	sphere.rigidbody.mass = size;
}


