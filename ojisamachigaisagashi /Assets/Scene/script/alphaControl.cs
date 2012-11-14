using UnityEngine;
using System.Collections;

public class alphaControl : MonoBehaviour {
	public float time = 1.0f;
	public float rTime = 0.0f;
	
	private int divideTime =7;
	
	public GameObject en;
	public GameObject gen;
	
	void Awake(){
		en = GameObject.Find("en");
		
		gen = GameObject.Find("gen");
		
		
		
	}
	void Start () {
		
	}

	// Update is called once per frame
	void Update () {
		tk2dSprite moji = en.GetComponent<tk2dSprite>();
		moji.color = new Color(1,1,1, time -= (Time.deltaTime/divideTime));
		
		tk2dSprite genMoji = gen.GetComponent<tk2dSprite>();
		genMoji.color = new Color(1,1,1,rTime);
		
		//print(time);
		if(time < 0.2){
			genMoji.color = new Color(1,1,1,rTime +=(Time.deltaTime/divideTime));
			
		}
		/*
		tk2dSprite enMoji;
		enMoji = en.GetComponent<tk2dSprite>();
		enMoji.color = new Color(1,1,1, 0);
		
		enMoji.color = new Color(1,1,1, time +=(Time.deltaTime/50));
		*/
			
	}
}
