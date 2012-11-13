#pragma strict
//*****************************************************************************************************************
// Enumeration uses by Easy Touch
//*****************************************************************************************************************
// No comments ....
enum GestureType{ Tap, Drag, Swipe, None, LongTap, Pinch, Twist, Cancel, Acquisition };

enum SwipeType{ None, Left, Right, Up, Down, Other};

//*****************************************************************************************************************
// Structure containing all information about a touch, Used by Easy Touch
// Easy Touch uses its own structure
//*****************************************************************************************************************
class Finger{

	var fingerIndex:int;				// Finger index
	var touchCount:int;					// Number of youch
	var startPosition:Vector2; 			// Starting position
	var complexStartPosition:Vector2;   // Stating position for two finger
	var position:Vector2;				// current position of the touch.
	var deltaPosition:Vector2;  		// The position delta since last change. 
	var oldPosition:Vector2;
	var tapCount:int;					// Number of taps.
	var deltaTime:float;				// Amount of time passed since last change.
	var phase:TouchPhase;				// Describes the phase of the touch.
	var gesture:GestureType;			
	var pickedObject:GameObject;
}

//*****************************************************************************************************************
// Structure returned in message by Easy Touch containing all informations about the gesture
//*****************************************************************************************************************
class Gesture{

	var fingerIndex:int;		// The index of the touch
	var touchCount:int;			// The number of touch (not the tap count)
	
	var startPosition:Vector2;	// The start position of the gesture.
	var position:Vector2;		// The current position of the touch.
	var deltaPosition:Vector2;	// The position delta since last change. 
	
	var actionTime:float;		// Time since the beginning of the gesture.
	var deltaTime:float;		// Amount of time passed since last change.

	var swipe:SwipeType;			// The siwpe type (see Swipe enumeration).
	var swipeLength:int;		// The length of the swipe.
	var swipeVector:Vector2;	// ....
	
	var deltaPinch:int;			// The pinch length delta since last change.
	var twistAngle:float;		// The angle of the twist.
	
	var pickObject:GameObject;	// The current picked gameObject
	var otherReceiver:GameObject; // other receiver of messages
}

