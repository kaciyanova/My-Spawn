using UnityEngine;
using System.Collections;

public class HP : MonoBehaviour {
	public Sprite[] hitSprites;
	private int spriteInd;
	private LevelManager levelManager;
	private LevelManager loadnextlevel;
	
	void Update(){
	hitPoints();
	}

	void hitPoints(){
	//PROPER WAY TO GET VARIABLES FROM OTHER SCRIPTS PLS REMEMB!!!!!!!
		GameObject normandy=GameObject.Find ("normandy");
		Normandy Normandy=normandy.GetComponent<Normandy>();
		int HP=(Normandy.shipHP)/100;
		spriteInd = 9-HP;
		
		//DEATH TRIGGER
		if (HP<=0){
			levelManager=GameObject.FindObjectOfType<LevelManager>();	
			Application.LoadLevel(Application.loadedLevel+1);
		}
		
		//sprite cycler
		if (HP>=10){}
		else{
			if (hitSprites[spriteInd]!=null){
				this.GetComponent<SpriteRenderer>().sprite=hitSprites[spriteInd];
			}
			else{
				Debug.LogError("add an HP sprite, dumbass");
			}
		}
	}
}
