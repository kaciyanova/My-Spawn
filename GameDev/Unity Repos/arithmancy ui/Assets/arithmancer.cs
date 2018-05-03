using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class arithmancer : MonoBehaviour {
	int max;
	int min;
	int guess; //var initialisation
	
	public int maxguessall=10;
	
	// Use this for initialization
	void Start () {
		StartGame(); //starts game
	}
	
	void StartGame(){
		min=1;
		max=1000;
		guess=Random.Range(
			min,
			max);//random guess	
		max=max+1;
		text.text=guess.ToString();
	}
	
	public Text text; 
		
	
	
	// Update is called once per frame
	void Update () { //the delicious meaty meat of the game

		}
		
	
	public void higher(){
		min=guess;
		NextGuess();
	}
	public void lower(){
		max=guess;
		NextGuess();
	}
	
	void NextGuess() {
		guess=Random.Range(min, max);//guess random in new range
		text.text=guess.ToString();
		maxguessall=maxguessall-1;
		if (maxguessall<=0){
			Application.LoadLevel("Lose");
		}
	}
}  