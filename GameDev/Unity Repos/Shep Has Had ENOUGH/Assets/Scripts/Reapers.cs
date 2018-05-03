using UnityEngine;
using System.Collections;

public class Reapers : MonoBehaviour {
	public static float scoreVal=150;
	private Score score;
	private Score scoreMeth;
	
	//pew pew
	public GameObject smoke;
	public static int breakCount=0;
	private Projectile dmg;
	private LevelManager levelManager;
	private float HP=500;
	
	//shooty
	public GameObject HitSmoke;
	public GameObject attfab;
	public static int dif;
	private AudioClip reaperpew;

	void FixedUpdate(){
		Shoot ();
		
	}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//formerly reaperobliterate,kills reapers
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	void smokePuff(){
		GameObject Smoke = Instantiate(smoke,gameObject.transform.position,Quaternion.identity) as GameObject;
		Smoke.particleSystem.startColor=gameObject.GetComponent<SpriteRenderer>().color;
	}
	
	void OnTriggerEnter2D(Collider2D collider){
		Projectile pew=collider.gameObject.GetComponent<Projectile>();
		if (pew){
			HP-=pew.dmg;
			pew.Hit();
			
			if (HP<=0){
				smokePuff();
				//anyway this is the right way 2 call a method frm another script idk why the other method was put in the 
				//tutorial but it didn't work and this does so fuck yuo
				score=GameObject.FindObjectOfType<Score>();	
				score.scoreMeth(scoreVal);
				Destroy(gameObject);
			}
		}
	}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////	


//reaper projectile shooter
	void Shoot(){
		int shoot=Random.Range(0,dif);		
		if (shoot==0&&this.gameObject!=null){
			GameObject shot=Instantiate(attfab,transform.position,Quaternion.identity) as GameObject;
			reaperpew=(AudioClip)Resources.Load ("reaperpew");
			AudioSource.PlayClipAtPoint(reaperpew,transform.position,.2f);
		}
		
	}
}