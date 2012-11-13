#pragma strict

var rotateSpeed:float;

function Start(){

	rotateSpeed = Random.Range(-60.0,60.0);
}

function Update(){

	transform.Rotate(Vector3(0,0,rotateSpeed)*Time.deltaTime);
}
