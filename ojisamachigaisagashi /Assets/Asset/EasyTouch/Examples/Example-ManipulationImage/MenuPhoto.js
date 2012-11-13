#pragma strict

private var bTwist:boolean=true;
private var bPinch:boolean=true;

function OnGUI() {
            
	GUI.matrix = Matrix4x4.Scale( Vector3( Screen.width / 1024.0, Screen.height / 768.0, 1 ) );
	
	GUI.Box( Rect( 0, -4, 1024, 30 ), "" );
	GUILayout.Label("Manipulation of an image : Twist, Pinch, Drag  with 1 or 2 fingers");
	
	GUILayout.Space(15);
	
	bTwist = GUILayout.Toggle(bTwist,"Enable Twist");
	EasyTouch.SetEnableTwist( bTwist);
	
	GUILayout.Space(15);
	
	bPinch = GUILayout.Toggle(bPinch,"Enable Pinch");
	EasyTouch.SetEnablePinch( bPinch);
	
	
	// Back to menu menu
	// Back to menu menu
	if (GUI.Button( Rect(412,700,200,50),"Main menu")){
		Application.LoadLevel("StartMenu");
	}	
}
