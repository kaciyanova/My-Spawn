using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class EndScore : MonoBehaviour {
	//private Score score;
	private Text text;
	public static float endscore;
	
	void Start () {
		text=GetComponent<Text>();
		
		endscore=Score.score/Reapers.scoreVal;
		if(endscore==0){
			text.text="NO";
		}
		else{
			text.text=endscore.ToString();
		}
	}
}
