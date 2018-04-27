using UnityEngine;
using System.Collections;
using UnityEngine.UI;
public class OptionsController : MonoBehaviour {
	public Slider volumeSlider,diffSlider;
	public LevelManager levelManager;
	private MusicManager music;
	// Use this for initialization
	void Start () {
		music=GameObject.FindObjectOfType<MusicManager>();
		volumeSlider.value=PlayerPrefsManager.GetMasterVolume();
		diffSlider.value=PlayerPrefsManager.GetDifficulty();
	}
	
	// Update is called once per frame
	void Update () {
		music.ChangeVol(volumeSlider.value);
	}
	
	public void SaveExit(){
		PlayerPrefsManager.SetMasterVolume(volumeSlider.value);
		PlayerPrefsManager.SetDifficulty(diffSlider.value);
		
		levelManager.loadlevel("10 Menu");
	}
	
	public void Defaults(){
		volumeSlider.value=.5f;
		diffSlider.value=2f;
	}
}
