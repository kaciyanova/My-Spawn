using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class Score : MonoBehaviour {
	public static float score;
	private Text scoretext;
	
	void Start(){
		scoretext=GetComponent<Text>();
		Reset();
	}

	public void scoreMeth(float points){
		score+=points;
		scoretext.text=score.ToString();
		
	}
	
	public void Reset(){
		score=0;
		scoretext.text=score.ToString();
		
	}
}