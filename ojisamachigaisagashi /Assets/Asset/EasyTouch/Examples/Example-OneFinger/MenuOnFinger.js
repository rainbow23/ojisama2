#pragma strict


function OnGUI() {
            
	GUI.matrix = Matrix4x4.Scale( Vector3( Screen.width / 1024.0, Screen.height / 768.0, 1 ) );
	
	GUI.Box( Rect( 0, -4, 1024, 30 ), "" );
	GUILayout.Label("Examples with one finger");
		
	// Back to menu menu
	if (GUI.Button( Rect(412,700,200,50),"Main menu")){
		Application.LoadLevel("StartMenu");
	}	
}

