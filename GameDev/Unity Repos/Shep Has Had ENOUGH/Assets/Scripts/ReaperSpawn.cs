using UnityEngine;
using System.Collections;

public class ReaperSpawn : MonoBehaviour {
	//movement
	public static bool right=true;
	public static float v;
	
	//initialisation/spawning
	public GameObject reaperfab;
	private Vector3 initransf;
	private float spawnDelay=.05f;
	
	private AudioClip BRAAAP;
	
	void Start () {	
		initransf=transform.position;//save initial position for respawns
		Respawn();
		//BRAAAAAP
		BRAAAP=(AudioClip)Resources.Load ("BRAAAP");
		AudioSource.PlayClipAtPoint(BRAAAP,transform.position,1);
	}	
	
	void FixedUpdate() {
	//controls direction of movement	
		float dir;
		if (right){
			dir=.005f;}
		else{
			dir=-.005f;}
		
		//speed vector
		transform.position=transform.position+new Vector3(dir*v,0,0);
		
	//respawns reapers on clear
		if (ReapersDead()){
			Respawn();
			//BRAAAAAP
			BRAAAP=(AudioClip)Resources.Load ("BRAAAP");
			AudioSource.PlayClipAtPoint(BRAAAP,transform.position,10f);
		}
	}
	
//shows reaper positions in scene
	public void OnDrawGizmos(){
		Gizmos.DrawWireCube(transform.position,new Vector3(6,8));
	}
	
//cleared reapers	
	bool ReapersDead(){
		foreach(Transform position in transform){
			if(position.childCount>0){
				return false;
			}			
		}	
		return true;
	}

//checks for empty reaper spots		
	bool freePositionIs(){
		foreach (Transform position in transform){
			if (position.childCount<=0){//if null reaps in position 
				return true;
			}
		}
		return false;
	}

//gets next position to spawn reaper at		
	Transform NextFreePos(){
		foreach(Transform position in transform){
			if(position.childCount<=0){//i
				return (position);
			}			
		}	
		return null;
	}

//spawns reaps one by one 
	void Respawn(){
		Transform freePos=NextFreePos();//gets transform of empty spots
		GameObject reaper=Instantiate(reaperfab,freePos.position,Quaternion.identity) as GameObject;//instantiates reaper

		reaper.transform.parent=freePos;
		
		if (freePositionIs()){
			Invoke ("Respawn",spawnDelay);//spawns reaps on delay, calls self
			
		}
	}

//spawns reaps all at once		
	void Spawn(){
		foreach(Transform child in transform){
			GameObject reaper=Instantiate(reaperfab,child.transform.position,Quaternion.identity) as GameObject;
			reaper.transform.parent=child;
			transform.position=initransf;
		}
	}
}