using UnityEngine;
using System.Collections;

public class MusicManager : MonoBehaviour {
	public AudioClip[] levelAudioArray;
	public AudioSource music;
	public bool loop=true;
	
	void Awake(){
		DontDestroyOnLoad(gameObject);
		
	}
		
	void Start () {
		music=GetComponent<AudioSource>();
		Debug.LogError(music);
		
		
	}
	
	public void ChangeVol(float vol){
		music.volume=vol;
		
		
	}

	void OnLevelWasLoaded(int level){
		Debug.Log(levelAudioArray[level]);
		
		AudioClip levelMusic=levelAudioArray[level];
		
		if (levelMusic && levelMusic != music.clip){//if clip exists & is not already playing
			music.clip=levelMusic;
			music.loop=loop;
			music.Play();
			
		}
		
	}

}
