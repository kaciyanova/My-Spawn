using UnityEngine;
using System.Collections;

public class Paddle : MonoBehaviour {
	public bool auto=true;
	private Ball ball;
	
	// Use this for initialization
	void Start(){
		ball=GameObject.FindObjectOfType<Ball>();
	}
	
	// Update is called once per frame
	void Update () {
		if (auto==true){
			Human();}
		else{
			Robot();
		}	
		
		}
	
	void Human(){
		Vector3 paddlePos=new Vector3(1f,transform.position.y,transform.position.z);
		Vector3 ballpos = ball.transform.position;
		paddlePos.x=Mathf.Clamp((ballpos.x),.75f,15.25f);
		transform.position=paddlePos;
	}
	
	void Robot(){
		Vector3 paddlePos=new Vector3(1f,transform.position.y,transform.position.z);
		float mousePosInBlocks = Input.mousePosition.x/Screen.width*16;
		paddlePos.x=Mathf.Clamp(mousePosInBlocks,.75f,15.25f);
		transform.position=paddlePos;
	}
}
