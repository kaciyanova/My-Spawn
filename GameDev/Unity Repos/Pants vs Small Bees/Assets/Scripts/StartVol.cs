using UnityEngine;
using System.Collections;

public class StartVol : MonoBehaviour {
	private MusicManager musicManager;
	
	// Use this for initialization
	void Start () {
		musicManager=GameObject.FindObjectOfType<MusicManager>();
		if (musicManager){
			float volume=PlayerPrefsManager.GetMasterVolume();
			musicManager.ChangeVol(volume);
		}
		else{
			Debug.Log("no music manager found");
		}
	}
	
}
