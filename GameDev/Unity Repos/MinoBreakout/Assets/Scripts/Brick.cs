using UnityEngine;
using System.Collections;

public class Brick : MonoBehaviour {
	public Sprite[] hitSprites;
	public static int breakCount=0;
	public GameObject smoke;
	
	private Vector3 smokepos;
	private int timesHit;
	private LevelManager levelManager;
	private bool Breakable;
	private AudioClip pop;
	
	private LevelManager loadnextlevel;
	
		
	// Use this for initialization
	void Start () {
		timesHit=0;
		Breakable=(this.tag=="Breakable");
		if (Breakable){
			breakCount++;
		//print (breakCount);
			pop=(AudioClip)Resources.Load ("pop");
		}
		
	}
	
	void handleHits(){
		
		timesHit+=1;
		int maxHits=hitSprites.Length+1;
		AudioSource.PlayClipAtPoint(pop,transform.position);
				
		if (timesHit>=maxHits){
			breakCount--;
			print (breakCount);
			levelManager=GameObject.FindObjectOfType<LevelManager>();	
			smokePuff();
			
			if (breakCount<=0){
				print ("next lvl");
				levelManager.loadnextlevel();}
				//Application.LoadLevel(Application.loadedLevel+1);}//for some reason wasn't working as imported from levelmanager in the standalone version but this does? wtf
			}else{
			LoadSprites();
		}
	}
	
	void smokePuff(){
		GameObject Smoke = Instantiate(smoke,gameObject.transform.position,Quaternion.identity) as GameObject;
		Smoke.particleSystem.startColor=gameObject.GetComponent<SpriteRenderer>().color;
		Destroy(gameObject);
	}
	void OnCollisionEnter2D (Collision2D collision){
		if (Breakable){
			handleHits();
		}
	}
	
	//void OnTriggerEnter2D (Collider2D trigger){
	//		print ("left");
	//		x+=2;
	
	
	void LoadSprites(){
		int spriteInd = timesHit-1;
		if (hitSprites[spriteInd]!=null){
			this.GetComponent<SpriteRenderer>().sprite=hitSprites[spriteInd];
		}
		else{
			Debug.LogError("No brick sprite!");
		}
	}
}
 
