using UnityEngine;
using System.Collections;

public class DirectionColl : MonoBehaviour {
	
	// Use this for initialization
	void Start () {
		ReaperSpawn.right=true;
	}
	
	void OnTriggerEnter2D(Collider2D trigger){
		ReaperSpawn.right=!ReaperSpawn.right;
	}
}
