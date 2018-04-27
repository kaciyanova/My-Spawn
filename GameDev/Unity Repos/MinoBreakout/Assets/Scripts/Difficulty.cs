using UnityEngine;
using System.Collections;

public class Difficulty : MonoBehaviour {
	// Use this for initialization

	public void Easy(){
		Ball.v=8;
		Application.LoadLevel(Application.loadedLevel+1);
	}
	public void Medium(){
		Ball.v=12;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
	public void Hard(){
		Ball.v=17;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
	public void Hardcore(){
		Ball.v=22;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
	public void why(){
		Ball.v=27;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
}
