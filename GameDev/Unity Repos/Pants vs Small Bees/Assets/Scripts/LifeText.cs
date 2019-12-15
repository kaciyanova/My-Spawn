using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class LifeText : MonoBehaviour {
	public Text text;
	
	void Update(){
		ShowRemainingLives();
	}
	
    void ShowRemainingLives(){
		//text.text=LoseCollider.lives.ToString();
	}
}
