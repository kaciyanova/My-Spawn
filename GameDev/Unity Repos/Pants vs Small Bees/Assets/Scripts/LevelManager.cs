using UnityEngine;
using System.Collections;

public class LevelManager : MonoBehaviour {
	public float timer;
	public bool timedcont=false;
	
	void Start(){
		if (timer<=0){
			Debug.Log("timer is less than 0!!");
		}
		else if (timedcont){
			Invoke ("loadnextlevel",timer);
		}
	}	

	void Update(){
		if (Application.loadedLevel==0 && timer>=0){
			if (Input.GetKeyDown(KeyCode.Escape)||Input.GetKeyDown(KeyCode.Space)||Input.GetMouseButtonDown(0)){
				loadnextlevel();
			}			
		}
		else{
			Debug.Log("timer is less than 0!!");
		}
	}
	
	public void loadlevel(string name){
		Debug.Log("lvl load req for: "+name);
		Application.LoadLevel(name);
	}
	public void quitreq(){
		Debug.Log("quit req");
		Application.Quit ();
		}
	
	public void loadnextlevel(){
		Application.LoadLevel(Application.loadedLevel+1);
		
	}
}
