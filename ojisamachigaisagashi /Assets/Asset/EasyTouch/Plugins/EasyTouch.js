//*****************************************************************************************************************
// EASY TOUCH V1.0
//
// This is the main script, you need to add it to your main camera or on a empty gameobject in your scene.
// If no gameobject is selected automatically (layer 8 by default) or set by the user,
// it's the gameobject with EsayTouch.js that receive all messages send by EasyTouch.
//
// ONLY ONE EasyTouch.js FOR A SCENE
//*****************************************************************************************************************
#pragma strict

//*****************************************************************************************************************
// The parameters to control Easy Touch. 
// You will need to adapt according to the resolution of the destination platform
//*****************************************************************************************************************
var enable:boolean = true;		// Enables or disables Easy Touch
var enable2FingersGesture:boolean=true; // Enables 2 fingers gesture.
var enableTwist:boolean=true;	// Enables or disables recognition of the twist
var enablePinch:boolean=true;	// Enables or disables recognition of the Pinch
var autoSelect:boolean = true;  // Enables or disables auto select
var pickableLayer:int=8;		// Layer detectable by default.
var StationnaryTolerance:float=25;		// 
var longTapTime:float = 1;		// The time required for the detection of a long tap.
var swipeTolerance:float= 0.85;	// Determines the accuracy of detecting a drag movement 0 => no precision 1=> high precision.
var minPinchLength:float=0;		// The minimum length for a pinch detection.
var minTwistAngle:float =1;		// The minimum angle for a twist detection.


//*****************************************************************************************************************
// Private variables used by Easy Touch
//*****************************************************************************************************************

private static var instance:EasyTouch;							// Fake singleton

private var complexCurrentGesture:GestureType = GestureType.None; // The current gesture 2 fingers
private var oldGesture:GestureType= GestureType.None;

private var startTimeAction:float;								// The time of onset of action.
private var fingers:Finger[]=new Finger[10];					// The informations of the touch for finger 1.

private var mainCam:Camera;										// The main camera of the scene, it has possessed the tag "MainCamera".

private var pickObject2Finger:GameObject;
private var receiverObject:GameObject = null; 					// Other object that can receive messages.

private var secondFingerTexture:Texture;						// The texture to display the simulation of the second finger.

private var startPosition2Finger:Vector2;						// Start position for two fingers gesture
private var twoFinger0:int;										// finger index
private var twoFinger1:int;										// finger index
private var oldStartPosition2Finger:Vector2;
private var oldFingerDistance:float;
private var twoFingerDragStart:boolean=false;
private var twoFingerSwipeStart:boolean=false;

private var oldTouchCount:int=0;

//*****************************************************************************************************************
//	Native Unity method
//*****************************************************************************************************************
function Awake(){

	// Assing the fake singleton
	instance = this;

	// We search the main camera with the tag MainCamera.
	// For automatic selection object.
	mainCam = GameObject.FindGameObjectWithTag("MainCamera").gameObject.camera;
	

	// The texture to display the simulation of the second finger.
	#if ((!UNITY_ANDROID && !UNITY_IPHONE) || UNITY_EDITOR)
	secondFingerTexture =Resources.Load("secondFinger") as Texture;
	#endif
}

// Display the simulation of the second finger
function OnGUI(){
	
	#if ((!UNITY_ANDROID && !UNITY_IPHONE) || UNITY_EDITOR)
		
		var finger:Vector2 = EasyTouchInput.GetSecondFingerPosition();
		if (finger!=Vector2(-1,-1)){		
			GUI.DrawTexture( Rect(finger.x-16,Screen.height-finger.y-16,32,32),secondFingerTexture);
		}
	#endif
	
}

// Non comments.
function Update(){

	if (enable){
		var i:int;
	
		// How many finger do we have ?
		var count:int = EasyTouchInput.TouchCount();
		
		// Reste after two finger gesture;
		if (oldTouchCount==2 && count!=2){
			//if (count>2){
				CreateGesture2Finger("On_Cancel2Fingers",Vector2.zero,Vector2.zero,Vector2.zero,0,SwipeType.None,0,Vector2.zero,0,0);
			//}
			for (i=0;i<10;i++){
				fingers[i]=null;
			}
		}
			
		// Get touches
		#if ((UNITY_ANDROID || UNITY_IPHONE) && !UNITY_EDITOR)
			for (var touch:Touch in Input.touches){
				if (!fingers[touch.fingerId]){
					fingers[touch.fingerId]= new Finger();
					fingers[touch.fingerId].fingerIndex = touch.fingerId;
					fingers[touch.fingerId].gesture = GestureType.None;
				}
				fingers[touch.fingerId].position = touch.position;
				fingers[touch.fingerId].deltaPosition = touch.deltaPosition;
				fingers[touch.fingerId].tapCount = touch.tapCount;
				fingers[touch.fingerId].deltaTime = touch.deltaTime;
				fingers[touch.fingerId].phase = touch.phase;	
				fingers[touch.fingerId].touchCount = count;
			}
			
		#else
			while (i<count){
				fingers[i] = EasyTouchInput.GetMouseTouch(i,fingers[i]) as Finger;
				fingers[i].touchCount = count;
				i++;
			}					
		#endif
	
		// two fingers gesture
		if (enable2FingersGesture){
			if (count==2){
				TwoFinger();
			}
			else{
				complexCurrentGesture = GestureType.None;
				pickObject2Finger=null;
				twoFingerSwipeStart = false;
				twoFingerDragStart = false;
			}
		}
		
		// Other fingers gesture
		for (i=0;i<9;i++){
			if (fingers[i]){
				OneFinger(i);
			}
		}
		
		oldTouchCount = count;
	}
}


//*****************************************************************************************************************
//	Management for one finger
//
// Gestures recognized :
// - TouchStart
// - Tap
// - Double tap
// - Long tap
// - Drag
// - Swipe
// - Automatic detection of selecting a gameobject below the touch if it has a collider and positioned on the layer 8
//*****************************************************************************************************************
function OneFinger(fingerIndex:int){

	var timeSinceStartAction:float;
	

	// A tap starts ?
	if ( fingers[fingerIndex].gesture==GestureType.None){
		
		startTimeAction = Time.time;
		fingers[fingerIndex].gesture=GestureType.Tap;
		fingers[fingerIndex].startPosition = fingers[fingerIndex].position;
		
		// do we touch a pickable gameobject ?
		if (autoSelect)
			fingers[fingerIndex].pickedObject = GetPickeGameObject(fingers[fingerIndex].startPosition);
			
		// we notify a touch
		CreateGesture("On_TouchStart",fingers[fingerIndex],0, SwipeType.None,0,Vector2.zero);
	}
	
	// Calculates the time since the beginning of the action.
	timeSinceStartAction =  Time.time -startTimeAction;
	
	
	// touch canceled?
	if (fingers[fingerIndex].phase == TouchPhase.Canceled){
		fingers[fingerIndex].gesture = GestureType.Cancel;
	}
	
	if (fingers[fingerIndex].phase != TouchPhase.Ended && fingers[fingerIndex].phase != TouchPhase.Canceled){
	
		// Are we stationary ?
		if (fingers[fingerIndex].phase == TouchPhase.Stationary && timeSinceStartAction >= longTapTime && fingers[fingerIndex].gesture == GestureType.Tap){
			fingers[fingerIndex].gesture = GestureType.LongTap;				
			CreateGesture("On_LongTapStart",fingers[fingerIndex],timeSinceStartAction, SwipeType.None,0,Vector2.zero);	
		}
		
		// Let's move us?
		if ((fingers[fingerIndex].gesture == GestureType.Tap ||fingers[fingerIndex].gesture == GestureType.LongTap) && (FingerInTolerance(fingers[fingerIndex])==false) ){
		
		
			//  long touch => cancel
			if (fingers[fingerIndex].gesture == GestureType.LongTap){
				fingers[fingerIndex].gesture = GestureType.Cancel;
				CreateGesture("On_LongTapEnd",fingers[fingerIndex],timeSinceStartAction,SwipeType.None,0,Vector2.zero);
				
			}
			else{
				// If an object is selected we drag
				if (fingers[fingerIndex].pickedObject){
					fingers[fingerIndex].gesture = GestureType.Drag;
					CreateGesture("On_DragStart",fingers[fingerIndex],timeSinceStartAction,SwipeType.None,0, Vector2.zero);
				}
				// If not swipe
				else{
					fingers[fingerIndex].gesture = GestureType.Swipe;
					CreateGesture("On_SwipeStart",fingers[fingerIndex],timeSinceStartAction, SwipeType.None,0,Vector2.zero);
				}
			}
		}
		
		// Gesture update
		var message:String;
		
		switch (fingers[fingerIndex].gesture){
			case GestureType.LongTap:
				message="On_LongTap";
				break;
			case GestureType.Drag:
				message="On_Drag";
				break;
			case GestureType.Swipe:
				message="On_Swipe";
				break;
		}
		
		// Send gesture
		if (message!=null){
			var currentSwipe:SwipeType = GetSwipe(Vector2(0,0),fingers[fingerIndex].deltaPosition);
			CreateGesture(message,fingers[fingerIndex],timeSinceStartAction, currentSwipe ,0,fingers[fingerIndex].deltaPosition);
		}
		
		// Stationnary
		CreateGesture("On_TouchDown",fingers[fingerIndex],timeSinceStartAction, currentSwipe,0,fingers[fingerIndex].deltaPosition);
	}
	else{
		
		
		// End of the touch		
		switch (fingers[fingerIndex].gesture){
			// tap
			case GestureType.Tap:
				if (fingers[fingerIndex].tapCount<2){
					CreateGesture( "On_SimpleTap",fingers[fingerIndex], timeSinceStartAction, SwipeType.None,0,Vector2.zero);
				}
				else{
					CreateGesture( "On_DoubleTap",fingers[fingerIndex], timeSinceStartAction, SwipeType.None,0,Vector2.zero);
				}
				break;
			// long tap
			case GestureType.LongTap:
				CreateGesture( "On_LongTapEnd",fingers[fingerIndex], timeSinceStartAction, SwipeType.None,0,Vector2.zero);
				break;
			// drag
			case GestureType.Drag:
				CreateGesture(  "On_DragEnd",fingers[fingerIndex], timeSinceStartAction, GetSwipe(fingers[fingerIndex].startPosition,fingers[fingerIndex].position), (fingers[fingerIndex].startPosition-fingers[fingerIndex].position).magnitude,fingers[fingerIndex].position-fingers[fingerIndex].startPosition);
				break;
			// swipe
			case GestureType.Swipe:
			 	CreateGesture( "On_SwipeEnd",fingers[fingerIndex], timeSinceStartAction, GetSwipe(fingers[fingerIndex].startPosition, fingers[fingerIndex].position), (fingers[fingerIndex].position-fingers[fingerIndex].startPosition).magnitude,fingers[fingerIndex].position-fingers[fingerIndex].startPosition); 
			 	break;
			// cancel
			case GestureType.Cancel:
				CreateGesture("On_TouchCancel",fingers[fingerIndex],0,SwipeType.None,0,Vector2.zero);
				break;
		}
			
		CreateGesture( "On_TouchUp",fingers[fingerIndex], timeSinceStartAction, SwipeType.None,0,Vector2.zero);
		fingers[fingerIndex]=null;		
	}
	
}

function CreateGesture(message:String,finger:Finger,actionTime:float, swipe:SwipeType, swipeLength:float,swipeVector:Vector2){

	if (pickObject2Finger){
		return false;
	}
	
	//Creating the structure with the required information
	var gesture:Gesture = new Gesture();
	
	gesture.fingerIndex = finger.fingerIndex;
	gesture.touchCount = finger.touchCount;
	gesture.startPosition = finger.startPosition;	
	gesture.position = finger.position;
	gesture.deltaPosition = finger.deltaPosition;
		
	gesture.actionTime = actionTime;
	gesture.deltaTime = finger.deltaTime;
	
	gesture.swipe = swipe;
	gesture.swipeLength = swipeLength;
	gesture.swipeVector = swipeVector;
	
	gesture.deltaPinch = 0;
	gesture.twistAngle = 0;
	gesture.pickObject = finger.pickedObject;
	gesture.otherReceiver = receiverObject;
	
	SendGesture(message,gesture);
	
	return true;
}

function SendGesture(message:String, gesture:Gesture){
	
	// Sent to user GameObject
	if (receiverObject!=null){
		if (receiverObject != gesture.pickObject){
			try{	
				receiverObject.SendMessage(message, gesture,SendMessageOptions.DontRequireReceiver );
			}
			catch(err){
			}
		}	
	}
	
	// Sent to the  GameObject who is selected
	if ( gesture.pickObject){
		try{	
			gesture.pickObject.SendMessage(message, gesture,SendMessageOptions.DontRequireReceiver );
		}
			catch(err){
		}
	}
	// sent to gameobject
	else{
		try{
	    	SendMessage(message, gesture,SendMessageOptions.DontRequireReceiver);
	    }
	    catch(err){
	    }
	}
}


//*****************************************************************************************************************
//	Management for tow fingers
//
// Gestures recognized :
// - TouchStart
// - tap
// - Double tap
// - Long tap 
// - Pinch
// - Twist
// - Drag
// - Swipe
//- Automatic detection of selecting a gameobject below the touch if it has a collider and positioned on the layer 8
//*****************************************************************************************************************
function TwoFinger(){

	var timeSinceStartAction:float;
	var move:boolean=false;
	var position:Vector2;
	var deltaPosition:Vector2;
	var fingerDistance:float;
		
	// A touch starts
	if ( complexCurrentGesture==GestureType.None){
		twoFinger0 = GetTwoFinger(-1);
		twoFinger1 = GetTwoFinger(twoFinger0);
		
		startTimeAction = Time.time;
		complexCurrentGesture=GestureType.Tap;
		
		fingers[twoFinger0].complexStartPosition = fingers[twoFinger0].position;
		fingers[twoFinger1].complexStartPosition = fingers[twoFinger1].position;
		
		fingers[twoFinger0].oldPosition = fingers[twoFinger0].position;
		fingers[twoFinger1].oldPosition = fingers[twoFinger1].position;
		
	
		oldFingerDistance = Mathf.Abs( Vector2.Distance(fingers[twoFinger0].position, fingers[twoFinger1].position));
		startPosition2Finger = Vector2((fingers[twoFinger0].position.x+fingers[twoFinger1].position.x)/2, (fingers[twoFinger0].position.y+fingers[twoFinger1].position.y)/2);
		deltaPosition = Vector2(0,0);
		
		// do we touch a pickable gameobject ?
		if (autoSelect){
			pickObject2Finger = GetPickeGameObject(fingers[twoFinger0].complexStartPosition);
			if (pickObject2Finger!= GetPickeGameObject(fingers[twoFinger1].complexStartPosition)){
				pickObject2Finger =null;
			}
		}
		
		// we notify the touch
		CreateGesture2Finger("On_TouchStart2Fingers",startPosition2Finger,startPosition2Finger,deltaPosition,timeSinceStartAction, SwipeType.None,0,Vector2.zero,0,0);				
	}
	
		
	// Calculates the time since the beginning of the action.
	timeSinceStartAction =  Time.time -startTimeAction;
	
	// Position & deltaPosition
	position = Vector2((fingers[twoFinger0].position.x+fingers[twoFinger1].position.x)/2, (fingers[twoFinger0].position.y+fingers[twoFinger1].position.y)/2);
	deltaPosition = position - oldStartPosition2Finger;
	fingerDistance = Mathf.Abs(Vector2.Distance(fingers[twoFinger0].position, fingers[twoFinger1].position));
	
	// Cancel
	if (fingers[twoFinger0].phase == TouchPhase.Canceled ||fingers[twoFinger1].phase == TouchPhase.Canceled){
		complexCurrentGesture = GestureType.Cancel;
	}
	
	// Let's go
	if (fingers[twoFinger0].phase != TouchPhase.Ended && fingers[twoFinger1].phase != TouchPhase.Ended && complexCurrentGesture != GestureType.Cancel ){
		
		// Are we stationary ?
		if (complexCurrentGesture == GestureType.Tap && timeSinceStartAction >= longTapTime && FingerInTolerance(fingers[twoFinger0]) && FingerInTolerance(fingers[twoFinger1])){	
			complexCurrentGesture = GestureType.LongTap;				
			// we notify the beginning of a longtouch
			CreateGesture2Finger("On_LongTapStart2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, SwipeType.None,0,Vector2.zero,0,0);				
		}	
		
		// Let's move us ?
		if (FingerInTolerance(fingers[twoFinger0])==false ||FingerInTolerance(fingers[twoFinger1])==false){
			move=true;
		}
 		
		
		// we move
		if (move){
					
			var dot:float = Vector2.Dot(fingers[twoFinger0].deltaPosition.normalized, fingers[twoFinger1].deltaPosition.normalized);
																																														
			// Pinch
			if (enablePinch && fingerDistance != oldFingerDistance ){
				// Pinch
				if (Mathf.Abs( fingerDistance-oldFingerDistance)>=minPinchLength){
					complexCurrentGesture = GestureType.Pinch;				
				}
				
				// update pinch
				if (complexCurrentGesture == GestureType.Pinch){	
					//complexCurrentGesture = GestureType.Acquisition;				
					if (fingerDistance<oldFingerDistance){
						
						// Send end message
						if (oldGesture != GestureType.Pinch){
							CreateStateEnd2Fingers(oldGesture,startPosition2Finger,position,deltaPosition,timeSinceStartAction,false); 
							startTimeAction = Time.time;
						}
						
						// Send pinch
						CreateGesture2Finger("On_PinchIn",startPosition2Finger,position,deltaPosition,timeSinceStartAction, GetSwipe(fingers[twoFinger0].complexStartPosition,fingers[twoFinger0].position),0,Vector2.zero,0,Mathf.Abs(fingerDistance-oldFingerDistance));
						complexCurrentGesture = GestureType.Pinch;

					}
					else if (fingerDistance>oldFingerDistance){
						// Send end message
						if (oldGesture != GestureType.Pinch){
							CreateStateEnd2Fingers(oldGesture,startPosition2Finger,position,deltaPosition,timeSinceStartAction,false);
							startTimeAction = Time.time;
						}
						
						// Send pinch
						CreateGesture2Finger("On_PinchOut",startPosition2Finger,position,deltaPosition,timeSinceStartAction, GetSwipe(fingers[twoFinger0].complexStartPosition,fingers[twoFinger0].position),0,Vector2.zero,0,Mathf.Abs(fingerDistance-oldFingerDistance));
						complexCurrentGesture = GestureType.Pinch;
					}	
				}
			}
				
			// Twist
			if (enableTwist){

				if (Mathf.Abs(TwistAngle())>minTwistAngle){
				
					// Send end message
					if (complexCurrentGesture != GestureType.Twist){
						CreateStateEnd2Fingers(complexCurrentGesture,startPosition2Finger,position,deltaPosition,timeSinceStartAction,false);
						startTimeAction = Time.time;
					}
					complexCurrentGesture = GestureType.Twist;
				}
						
				// Update Twist
				if (complexCurrentGesture == GestureType.Twist){
					CreateGesture2Finger("On_Twist",startPosition2Finger,position,deltaPosition,timeSinceStartAction, SwipeType.None,0,Vector2.zero,TwistAngle(),0);
				}

				fingers[twoFinger0].oldPosition = fingers[twoFinger0].position;
				fingers[twoFinger1].oldPosition = fingers[twoFinger1].position;
			}
	
			// Drag
			if (dot>0 ){
							
				if (pickObject2Finger && !twoFingerDragStart){
					// Send end message
					if (complexCurrentGesture != GestureType.Tap){
						CreateStateEnd2Fingers(complexCurrentGesture,startPosition2Finger,position,deltaPosition,timeSinceStartAction,false);
						startTimeAction = Time.time;
					}
					//
					CreateGesture2Finger("On_DragStart2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, SwipeType.None,0,Vector2.zero,0,0);	
					twoFingerDragStart = true; 
				}
				else if (!pickObject2Finger && !twoFingerSwipeStart ) {
					// Send end message
					if (complexCurrentGesture!= GestureType.Tap){
						CreateStateEnd2Fingers(complexCurrentGesture,startPosition2Finger,position,deltaPosition,timeSinceStartAction,false);
						startTimeAction = Time.time;
					}
					//
					CreateGesture2Finger("On_SwipeStart2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, SwipeType.None,0,Vector2.zero,0,0);
					twoFingerSwipeStart=true;
				}
			} 
			else{
				 twoFingerDragStart=false; 
				 twoFingerSwipeStart=false;
			}
		
			//
			if (twoFingerDragStart){
				CreateGesture2Finger("On_Drag2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, GetSwipe(oldStartPosition2Finger,position),0,deltaPosition,0,0);
			}
			
			if (twoFingerSwipeStart){
				CreateGesture2Finger("On_Swipe2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, GetSwipe(oldStartPosition2Finger,position),0,deltaPosition,0,0);
			}
							
		}
		else{
			// Long tap update
	 		if (complexCurrentGesture == GestureType.LongTap){
				CreateGesture2Finger("On_LongTap2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, SwipeType.None,0,Vector2.zero,0,0);
			}
		}

		CreateGesture2Finger("On_TouchDown2Fingers",startPosition2Finger,position,deltaPosition,timeSinceStartAction, GetSwipe(oldStartPosition2Finger,position),0,deltaPosition,0,0);
	
		
		oldFingerDistance = fingerDistance;
		oldStartPosition2Finger = position;
		oldGesture = complexCurrentGesture;
	}
	else{
		CreateStateEnd2Fingers(complexCurrentGesture,startPosition2Finger,position,deltaPosition,timeSinceStartAction,true);
		complexCurrentGesture = GestureType.None;
		pickObject2Finger=null;
		twoFingerSwipeStart = false;
		twoFingerDragStart = false;
	}	
}

function GetTwoFinger( index:int){

	var i:int=index+1;
	var find:boolean=false;
	
	while (i<10 && !find){
		if (fingers[i] ){
			if( i>=index){
				find=true;
			}
		}
		i++;
	}
	i--;
	
	return i;
}

function CreateStateEnd2Fingers(gesture:GestureType, startPosition:Vector2,position:Vector2,deltaPosition:Vector2,time:float, realEnd:boolean){

	switch (gesture){
		// Tap
		case GestureType.Tap:
			if (fingers[twoFinger0].tapCount<2 && fingers[twoFinger1].tapCount<2){
				CreateGesture2Finger("On_SimpleTap2Fingers",startPosition,position,deltaPosition,
				time, SwipeType.None,0,Vector2.zero,0,0);				
			}
			else{
				CreateGesture2Finger("On_DoubleTap2Fingers",startPosition,position,deltaPosition,
				time, SwipeType.None,0,Vector2.zero,0,0);
			}
		break;
	
		// Long tap
		case GestureType.LongTap:
			CreateGesture2Finger("On_LongTapEnd2Fingers",startPosition,position,deltaPosition,
			time, SwipeType.None,0,Vector2.zero,0,0);
			break;
	
		// Pinch 
		case GestureType.Pinch:
			CreateGesture2Finger("On_PinchEnd",startPosition,position,deltaPosition,
			time, SwipeType.None,0,Vector2.zero,0,0);
			break;
	
		// twist
		case GestureType.Twist:
			CreateGesture2Finger("On_TwistEnd",startPosition,position,deltaPosition,
			time, SwipeType.None,0,Vector2.zero,0,0);
			break;	
	}
	
	if (realEnd){
		// Drag
		if ( twoFingerDragStart){
			CreateGesture2Finger("On_DragEnd2Fingers",startPosition,position,deltaPosition,
			time, GetSwipe( startPosition, position),( position-startPosition).magnitude,position-startPosition,0,0);
		};
			
		// Swipe
		if ( twoFingerSwipeStart){
			CreateGesture2Finger("On_SwipeEnd2Fingers",startPosition,position,deltaPosition,
			time, GetSwipe( startPosition, position),( position-startPosition).magnitude,position-startPosition,0,0);
		}
				
		CreateGesture2Finger("On_TouchUp2Fingers",startPosition,position,deltaPosition,time, SwipeType.None,0,Vector2.zero,0,0);
	}
}

function CreateGesture2Finger(message:String,startPosition:Vector2,position:Vector2,deltaPosition:Vector2
,actionTime:float, swipe:SwipeType, swipeLength:float,swipeVector:Vector2,twist:float,pinch:float){

	//Creating the structure with the required information
	var gesture:Gesture = new Gesture();
	
	gesture.touchCount=2;
	gesture.fingerIndex=-1;
	gesture.startPosition = startPosition;	
	gesture.position = position;
	gesture.deltaPosition = deltaPosition;
		
	gesture.actionTime = actionTime;
	
	if (fingers[twoFinger0])
		gesture.deltaTime = fingers[twoFinger0].deltaTime;
	else if (fingers[twoFinger1])
		gesture.deltaTime = fingers[twoFinger1].deltaTime;
	else
		gesture.deltaTime=0;
	
	gesture.swipe = swipe;
	gesture.swipeLength = swipeLength;
	gesture.swipeVector = swipeVector;
	
	gesture.deltaPinch = pinch;
	gesture.twistAngle = twist;
	gesture.pickObject = pickObject2Finger;
	gesture.otherReceiver = receiverObject;
	
	SendGesture2Finger(message,gesture );
}

function SendGesture2Finger(message:String, gesture:Gesture){
	
	// Sent to user GameObject
	if (receiverObject!=null){
		if (receiverObject != pickObject2Finger){
			try{	
				receiverObject.SendMessage(message, gesture,SendMessageOptions.DontRequireReceiver );
			}
			catch(err){
			}
		}	
	}
	
	// Sent to the  GameObject who is selected
	if ( pickObject2Finger){
		try{	
			pickObject2Finger.SendMessage(message, gesture,SendMessageOptions.DontRequireReceiver );
		}
		catch(err){
		}
	}
	// sent to gameobject
	else{
		try{
	    	SendMessage(message, gesture,SendMessageOptions.DontRequireReceiver);
	    }
	    catch(err){
	    }
	}
}


//*****************************************************************************************************************
// Reseach if an objet can be selected
//*****************************************************************************************************************
function GetPickeGameObject(screenPos:Vector2){

        var ray:Ray = mainCam.ScreenPointToRay( screenPos );
        var hit:RaycastHit;
		
		var layer:int = (1 << pickableLayer);
		
        if( Physics.Raycast( ray, hit,float.MaxValue,layer ) )
            return hit.collider.gameObject;

        return null;
}

//*****************************************************************************************************************
// Determines the direction of the swipe
//*****************************************************************************************************************
function GetSwipe(start:Vector2, end:Vector2){

	var linear:Vector2 ;
	linear = (end - start).normalized;
	
	if (Mathf.Abs(linear.y)>Mathf.Abs(linear.x)){
		if ( Vector2.Dot( linear, Vector2.up) >= swipeTolerance)
			return SwipeType.Up;
			
		if ( Vector2.Dot( linear, -Vector2.up) >= swipeTolerance)
			return SwipeType.Down;		
	}
	else{
		if ( Vector2.Dot( linear, Vector2.right) >= swipeTolerance)
			return SwipeType.Right;
	
		if ( Vector2.Dot( linear, -Vector2.right) >= swipeTolerance)
			return SwipeType.Left;
	}					
	
	return SwipeType.Other;			
}

//*****************************************************************************************************************
// Return if a finger is in the staionnary tolerance 
//*****************************************************************************************************************
function FingerInTolerance(finger:Finger ){

	if ((finger.position-finger.startPosition).sqrMagnitude <= (StationnaryTolerance*StationnaryTolerance)){
		return true;
	}
	else{
		return false;
	}
}

//*****************************************************************************************************************
// Calculate the angle difference between two vector
//*****************************************************************************************************************
function DeltaAngle(start:Vector2, end:Vector2){

	var tmp = (start.x * end.y)-(start.y*end.x);
	return Mathf.Atan2(tmp,Vector2.Dot( start,end));
	
}

//*****************************************************************************************************************
// Calculate the delta angle between two fingers
//*****************************************************************************************************************
function TwistAngle(){

	var dir:Vector2 = (fingers[twoFinger0].position-fingers[twoFinger1].position);
	var refDir:Vector2 =(fingers[twoFinger0].oldPosition - fingers[twoFinger1].oldPosition);
	var angle:float =  Mathf.Rad2Deg * DeltaAngle(refDir,dir);
	return angle;
}


//*****************************************************************************************************************
//	Easy Touch Static method for easy access
//****************************************************************************************************************

// Enables or disables Easy Touch
static function SetEnabled( enable:boolean){
	EasyTouch.instance.enable = enable;
}

static function GetEnabled(){
	return EasyTouch.instance.enable;
}

// Enables 2 fingers gesture.
static function SetEnable2FingersGesture( enable:boolean){
	EasyTouch.instance.enable2FingersGesture = enable;
}

static function GetEnable2FingersGesture(){
	return EasyTouch.instance.enable2FingersGesture;
}

//Enables or disables recognition of the twist
static function SetEnableTwist( enable:boolean){
	EasyTouch.instance.enableTwist = enable;
}

static function GetEnableTwist(){
	return EasyTouch.instance.enableTwist;
}

// Enables or disables recognition of the Pinch
static function SetEnablePinch( enable:boolean){
	EasyTouch.instance.enablePinch = enable;
}

static function GetEnablePinch(){
	return EasyTouch.instance.enablePinch;
}

// Enables or disables auto select
static function SetEnableAutoSelect( enable:boolean){
	EasyTouch.instance.autoSelect = enable;
}

static function GetEnableAutoSelect(){
	return EasyTouch.instance.autoSelect;
}

// Set a recever Object who receive the messages from Easy touch
static function SetOtherReceiverObject( receiver:GameObject){
	EasyTouch.instance.receiverObject = receiver;
}

static function GetOtherReceiverObject(){
	return EasyTouch.instance.receiverObject;
}

// Set the pickable layer
static function SetPickableLayer( layer:int){
	EasyTouch.instance.pickableLayer = layer;
}

static function GetPickableLayer(){
	return EasyTouch.instance.pickableLayer;
}

// Set the move tolerance
static function SetStationnaryTolerance(tolerance:float){
	EasyTouch.instance.StationnaryTolerance = tolerance;
}

static function GetStationnaryTolerance(){
	return EasyTouch.instance.StationnaryTolerance;
}


// Set the long tap time
static function SetlongTapTime( time:float){
	EasyTouch.instance.longTapTime = time;
}

static function GetlongTapTime(){
	return EasyTouch.instance.longTapTime;
}

// Set the swipe tolerance
static function SetSwipeTolerance( tolerance:float){
	EasyTouch.instance.swipeTolerance = tolerance;
}

static function GetSwipeTolerance(){
	return EasyTouch.instance.swipeTolerance;
}

// The minimum length for a pinch detection.
static function SetMinPinchLength( length:float){
	EasyTouch.instance.minPinchLength=length;
}

static function GetMinPinchLength(){
	return EasyTouch.instance.minPinchLength;
}

// Set the minimun twist angle
static function SetMinTwistAngle( angle:float){
	EasyTouch.instance.minTwistAngle = angle;
}

static function GetMinTwistAngle(){
	return EasyTouch.instance.minTwistAngle;
}

