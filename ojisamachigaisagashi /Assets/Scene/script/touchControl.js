#pragma strict
var batsu : GameObject;
batsu = GameObject.Find("batsu");
var answer : tk2dSprite;
answer = batsu.GetComponent(tk2dSprite);

function Start () {
	batsu.active = false;
}

function Update () {
	
	if(Input.GetButtonDown("Fire1")){
		//スクリーン座標系を取得
		var screenPoint = Input.mousePosition;
		//print(screenPoint);
		
		//クリックした点をワールド座標系に変換
		var worldPoint = camera.ScreenToWorldPoint(screenPoint);
		//クリックした点のワールド座標系からrayを出す
		var ray : Ray = camera.ScreenPointToRay(screenPoint);
		var hit : RaycastHit;
		
		//batsuゲームオブジェクトをクリックした点に配置し、zを-40にして配置
		batsu.active = true;
		batsu.transform.position = worldPoint;
		batsu.transform.position.z = -40;
		
		if (Physics.Raycast (ray, hit)) {
			//Colliderがあったら
			print("hit");
			answer.spriteId = answer.GetSpriteIdByName("rightAnswer");
		}
		else{
			//Colliderがなかったら
			print("not hit");
			answer.spriteId = answer.GetSpriteIdByName("wrongAnswer");
		}
	}
}