#pragma strict

function On_SimpleTap2Fingers( gesture:Gesture){
	gameObject.renderer.material.color = Color( Random.Range(0.0,1.0),  Random.Range(0.0,1.0), Random.Range(0.0,1.0));
}