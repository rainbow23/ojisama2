//*****************************************************************************************************************
// This class return informations about the touch & tap, and simulate with mouse 
//
// Don't use it in you source code.
//*****************************************************************************************************************
#pragma strict

public static class EasyTouchInput{

	private var oldMousePosition:Vector2[] = new Vector2[2];
	private var tapCount:int[] = new int[2];
	private var startActionTime:float[] = new float[2];
	private var deltaTime:float[] = new float[2];
	private var tapeTime:float[] = new float[2];
	
	// Complexe 2 fingers simulation
	private var bComplex:boolean=false;
	private var deltaFingerPosition:Vector2;
	private var oldFinger2Position:Vector2;
	private var complexCenter:Vector2;
	
	
	
	// Return the number of touch
	function TouchCount(){
	
		var count:int;
		
		#if ((UNITY_ANDROID || UNITY_IPHONE) && !UNITY_EDITOR)
			count = Input.touchCount;
		#else
			if (Input.GetMouseButton(0) || Input.GetMouseButtonUp(0)){
				count=1;
				if (Input.GetKey(KeyCode.LeftAlt) || Input.GetKey(KeyCode.RightAlt)|| Input.GetKey(KeyCode.LeftControl) ||Input.GetKey(KeyCode.RightControl ))
					count=2;
				if (Input.GetKeyUp(KeyCode.LeftAlt)|| Input.GetKeyUp(KeyCode.RightAlt)|| Input.GetKeyUp(KeyCode.LeftControl)|| Input.GetKeyUp(KeyCode.RightControl))
					count=2;
			}
		#endif
		
		return count;
	}
	
	
	// return in Finger structure all informations on an touch
	function GetMouseTouch(fingerIndex:int,myFinger:Finger){
		
		
		var finger:Finger;
		
		if (myFinger){
			finger = myFinger;
		}
		else{
			finger = new Finger();
			finger.gesture = GestureType.None;
		}
		
		
		if (fingerIndex==1 && (Input.GetKeyUp(KeyCode.LeftAlt)|| Input.GetKeyUp(KeyCode.RightAlt)|| Input.GetKeyUp(KeyCode.LeftControl)|| Input.GetKeyUp(KeyCode.RightControl))){
			
			finger.fingerIndex = fingerIndex;
			finger.position = oldFinger2Position; 
			finger.deltaPosition = finger.position - oldFinger2Position;
			finger.tapCount = tapCount[fingerIndex];
			finger.deltaTime = Time.time-deltaTime[fingerIndex];
			finger.phase = TouchPhase.Ended;
			
			return finger;			
		}
			
		if (Input.GetMouseButton(0)){
			
			finger.fingerIndex = fingerIndex;
			finger.position = GetPointerPosition(fingerIndex);
			
			if (Time.time-tapeTime[fingerIndex]>0.5){
				tapCount[fingerIndex]=0;
			}
			
			if (Input.GetMouseButtonDown(0) || (fingerIndex==1 && (Input.GetKeyDown(KeyCode.LeftAlt)|| Input.GetKeyDown(KeyCode.RightAlt)|| Input.GetKeyDown(KeyCode.LeftControl)|| Input.GetKeyDown(KeyCode.RightControl)))){
				
				// Began						
				finger.position = GetPointerPosition(fingerIndex);
				finger.deltaPosition = Vector2.zero;
				tapCount[fingerIndex]=tapCount[fingerIndex]+1;
				finger.tapCount = tapCount[fingerIndex];
				startActionTime[fingerIndex] = Time.time;
				deltaTime[fingerIndex] = startActionTime[fingerIndex];
				finger.deltaTime = 0;
				finger.phase = TouchPhase.Began;
				
				
				if (fingerIndex==1){
					oldFinger2Position = finger.position;
				}
				else{
					oldMousePosition[fingerIndex] = finger.position;
				}

				if (tapCount[fingerIndex]==1){
					tapeTime[fingerIndex] = Time.time;
				}

				
				return finger;
			}	
     

       		finger.deltaPosition = finger.position - oldMousePosition[fingerIndex];
       		
       		finger.tapCount = tapCount[fingerIndex];
       		finger.deltaTime = Time.time-deltaTime[fingerIndex];
			if (finger.deltaPosition.sqrMagnitude <1){
				finger.phase = TouchPhase.Stationary;
			}
			else{
				finger.phase = TouchPhase.Moved;
			}

			oldMousePosition[fingerIndex] = finger.position;
			deltaTime[fingerIndex] = Time.time;
        			
			return finger;
		}
		
		else if (Input.GetMouseButtonUp(0)){
			finger.fingerIndex = fingerIndex;
			finger.position = GetPointerPosition(fingerIndex);
			finger.deltaPosition = finger.position - oldMousePosition[fingerIndex];
			finger.tapCount = tapCount[fingerIndex];
			finger.deltaTime = Time.time-deltaTime[fingerIndex];
			finger.phase = TouchPhase.Ended;
			oldMousePosition[fingerIndex] = finger.position;
			
			return finger;
		}
			
		
		return null;
	}

	// Get the postion of simulate finger
	function GetPointerPosition( index:int):Vector2{
	
		var pos:Vector2;
		
		if (index==0){
			pos= Input.mousePosition;
			return pos;
		}
		else{
			return GetSecondFingerPosition();
			
		}
	}
	
	// Get the position of the simulate second finger
	function GetSecondFingerPosition():Vector2{
		
		var pos:Vector2 = Vector2(-1,-1);
		
		if ((Input.GetKey(KeyCode.LeftAlt)|| Input.GetKey(KeyCode.RightAlt)) && (Input.GetKey(KeyCode.LeftControl)|| Input.GetKey(KeyCode.RightControl))){
			if (!bComplex){
				bComplex=true;
				deltaFingerPosition = Input.mousePosition - oldFinger2Position;
			}
			pos = GetComplex2finger();
			return pos;
		}
		else if (Input.GetKey(KeyCode.LeftAlt)|| Input.GetKey(KeyCode.RightAlt) ){		
			pos =  GetPinchTwist2Finger();
			bComplex = false;
			return pos;
		}else if (Input.GetKey(KeyCode.LeftControl)|| Input.GetKey(KeyCode.RightControl) ){	

			pos =GetComplex2finger();
			bComplex = false;
			return pos;
		}
		
		return pos;		
	}
	
	// Simulate for a twist or pinc
	function GetPinchTwist2Finger(){

		var position:Vector2;
		
		if (complexCenter==Vector2(0,0)){
			position.x = (Screen.width/2.0) - (Input.mousePosition.x - (Screen.width/2.0)) ;
			position.y = (Screen.height/2.0) - (Input.mousePosition.y - (Screen.height/2.0));
		}
		else{
			position.x = (complexCenter.x) - (Input.mousePosition.x - (complexCenter.x)) ;
			position.y = (complexCenter.y) - (Input.mousePosition.y - (complexCenter.y));
		}
		oldFinger2Position = position;
		return position;
	}
	
	// complexe Alt + Ctr
	function GetComplex2finger(){
	
		var position:Vector2;
		
		position.x = Input.mousePosition.x - deltaFingerPosition.x;
		position.y = Input.mousePosition.y - deltaFingerPosition.y;
		
		complexCenter = Vector2((Input.mousePosition.x+position.x)/2, (Input.mousePosition.y+position.y)/2);
		oldFinger2Position = position;
		return position;
	}

}

