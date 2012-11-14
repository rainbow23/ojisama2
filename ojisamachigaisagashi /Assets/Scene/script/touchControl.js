#pragma strict
function On_SimpleTap(gesture:Gesture){
//print("touch");
}
function Start () {

}

var batsu : GameObject;
batsu = GameObject.Find("batsu");

var answer : tk2dSprite;
answer = batsu.GetComponent(tk2dSprite);


function Update () {
	if(Input.GetButtonDown("Fire1")){
		//クリックした天をワールド座標系に変換
		var screenPoint = Input.mousePosition;
		screenPoint.z = -40.0;
		var worldPoint = camera.ScreenToWorldPoint(screenPoint);
		
		batsu.transform.position = worldPoint;
		batsu.transform.position.z = -40;
		print(batsu.transform.position);
		
		if(batsu.transform.position.x > 345.0){
			print("batsu");
			answer.spriteId = answer.GetSpriteIdByName("wrongAnswer");
			}
			else if(batsu.transform.position.x < 390.0){
				print("maru");
			}
		}
}