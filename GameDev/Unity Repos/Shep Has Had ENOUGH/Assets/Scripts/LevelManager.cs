using UnityEngine;
using System.Collections;

public class LevelManager : MonoBehaviour {

	void Start(){
		
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
