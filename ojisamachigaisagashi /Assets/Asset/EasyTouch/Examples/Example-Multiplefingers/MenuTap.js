#pragma strict

function OnGUI() {
            
	GUI.matrix = Matrix4x4.Scale( Vector3( Screen.width / 1024.0, Screen.height / 768.0, 1 ) );
	
	GUI.Box( Rect( 0, -4, 1024, 30 ), "" );
	GUILayout.Label("Example of multiple fingers (10 max) :  touch, tap, long tap, pinch");
	GUILayout.Space(10);
	GUILayout.Label( "Touch => Creation of a circle under each touches");
	GUILayout.Label( "Tap on circle => Add ring under each touches ");
	GUILayout.Label( "Long tap on circle => Change the ring speed under each touches");
	GUILayout.Label( "Drag => move the circles under the touches");
	GUILayout.Label( "Pinch on circle => Size change");
	
	// Back to menu menu
	if (GUI.Button( Rect(412,700,200,50),"Main menu")){
		Application.LoadLevel("StartMenu");
	}	
}
