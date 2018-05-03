using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class LifeText : MonoBehaviour {
	public Text text;
	
	void Update(){
		lifeText();
	}
	
	void lifeText(){
		text.text=LoseCollider.lives.ToString();
	}
}
