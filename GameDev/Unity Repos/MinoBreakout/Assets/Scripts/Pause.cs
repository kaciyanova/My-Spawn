using UnityEngine;
using System.Collections;

public class Pause : MonoBehaviour {
	GameObject[] pause; 
	public bool paused;
	
	// Use this for initialization
	void Start () {
		pause=GameObject.FindGameObjectsWithTag("ShowOnPause");
		hidePaused();
		paused=false;
	}
	
	void Update () {
		if (Input.GetKeyDown(KeyCode.Space)||Input.GetKeyDown(KeyCode.Escape)){
				paused=!paused;
			if (paused){
				Time.timeScale=0;
				//print ("paused");
				showPaused();
				
			}
			else if (!paused){
				Time.timeScale=1;
				//print ("unpaused");
				hidePaused();
				
			}	
		}
	}
	
	
	//use only for buttons		
	public void pauseControl(){
		if (Time.timeScale==1){
			Time.timeScale=0;
			showPaused();
		}
		else if (Time.timeScale==0){
			Time.timeScale=1;
			hidePaused();
		}
	}

	
//to show/hide pause elements	
	public void showPaused(){
		foreach(GameObject g in pause){
			g.SetActive(true);
			
		}
	}
	
	public void hidePaused(){
		foreach(GameObject g in pause){
			g.SetActive(false);
			
		}		
	}
	
}