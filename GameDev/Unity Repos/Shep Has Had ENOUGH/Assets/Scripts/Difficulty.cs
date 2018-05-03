using UnityEngine;
using System.Collections;

public class Difficulty : MonoBehaviour {
	// Use this for initialization
	
	public void Easy(){
		ReaperSpawn.v=8;
		Reapers.dif=500;
		Application.LoadLevel(Application.loadedLevel+1);
	}
	public void Medium(){
		ReaperSpawn.v=12;
		Reapers.dif=400;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
	public void Hard(){
		ReaperSpawn.v=17;
		Reapers.dif=300;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
	public void Hardcore(){
		ReaperSpawn.v=22;
		Reapers.dif=200;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
	public void why(){
		ReaperSpawn.v=27;
		Reapers.dif=100;
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
}
