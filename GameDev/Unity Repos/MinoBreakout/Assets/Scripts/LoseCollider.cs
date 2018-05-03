using UnityEngine;
using System.Collections;

public class LoseCollider : MonoBehaviour {
	private LevelManager levelManager;
	public static float lives;
	public static bool reset;
	private AudioClip lyflost;
	
	void Start () {
		levelManager=GameObject.FindObjectOfType<LevelManager>();
		lives=5;
		reset=false;
		lyflost=(AudioClip)Resources.Load ("lyflost");
		
		}

	void OnTriggerEnter2D (Collider2D trigger){
		AudioSource.PlayClipAtPoint(lyflost,transform.position);
		lives-=.5f;//double trigger workaround tbh lmao fuk ma lyf		
		if (lives<=0){
			levelManager.loadlevel("Lose");
		}
	}
}
