using UnityEngine;
using System.Collections;

public class alphaControl : MonoBehaviour {

	// Use this for initialization
	void Start () {
		tk2dSprite sprite = GetComponent<tk2dSprite>();
	sprite.color = new Color(1,1,1, 0.0f);
	print(sprite.color);
		
	}

	public float time;
	
	
	// Update is called once per frame
	void Update () {
		tk2dSprite sprite = GetComponent<tk2dSprite>();
		sprite.color = new Color(1,1,1, 0.5f);
	}
}
