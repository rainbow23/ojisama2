#pragma strict

function Start(){

		EasyTouch.SetOtherReceiverObject( gameObject );
}

function OnGUI() {
            
	GUI.matrix = Matrix4x4.Scale( Vector3( Screen.width / 1024.0, Screen.height / 768.0, 1 ) );
	
	GUI.Box( Rect( 0, -4, 1024, 70 ), "" );
	
}

function On_SimpleTap( gesture:Gesture){

	if ( gesture.pickObject){
		var levelName:String= gesture.pickObject.name;

		if (levelName=="OneFinger")
			Application.LoadLevel("Onefinger");
		else if (levelName=="TwoFinger")		
			Application.LoadLevel("TwoFinger");
		else if (levelName=="MultipleFinger")		
			Application.LoadLevel("MultipleFingers");			
		else if (levelName=="GameController")
			Application.LoadLevel("GameController");
		else if (levelName=="FreeCamera")
			Application.LoadLevel("FreeCam");			
		else if (levelName=="ImageManipulation")
			Application.LoadLevel("ManipulationImage");
		else if (levelName=="Exit")
			Application.Quit();						
	}
	
}