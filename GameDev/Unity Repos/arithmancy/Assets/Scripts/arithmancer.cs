using UnityEngine;
using System.Collections;
using System.Collections;

public class arithmancer : MonoBehaviour {
	int max;
	int min;
	int guess; //var initialisation
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
		
		print ("==============================================");//for clarity
		print ("Welcome to Arithmancer");
		print ("Pick a number in your head, but don't tell me");
		print ("The highest number you can pick is "+max);
		print ("The lowest number you can pick is "+min);
		print ("Is the number higher or lower than "+guess+"?");
		print ("Up arrow = higher, down arrow = lower, enter = equal");//instructions
		max=max+1;
	}
	
	
	// Update is called once per frame
	void Update () { //the delicious meaty meat of the game
		if (Input.GetKeyDown(KeyCode.UpArrow)) {
			//if number lower than guess
			min=guess;
			NextGuess();}
		else if (Input.GetKeyDown(KeyCode.DownArrow)) {
			//if num higher than guess
			max=guess;
			NextGuess();}
		else if (Input.GetKeyDown(KeyCode.Return)){
			print("I won!");//sucka
			//play again
			print ("Would you like to play again? (y/n)");}
		if (Input.GetKeyDown(KeyCode.Y)){
			StartGame();}
		else if (Input.GetKeyDown(KeyCode.N)) {
			print ("Thanks for playing!");//end game
		}
	}	
	
	void NextGuess() {
		guess=Random.Range(
			min,
			max);//guess random in new range
		print ("Is the number higher or lower than "+guess+"?");
		print ("Up arrow = higher, down arrow = lower, enter = equal");
	}
}  