using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class EndReapers : MonoBehaviour {
	private Text text;
	private bool one=false;
	// Use this for initialization
	void Start () {
		text=GetComponent<Text>();
		
		if (Score.score==150){
			one=true;
		}
					
		if(one){
			text.text="Reaper";
		}
		else{
			text.text="Reapers";
		}
	}
	

}
