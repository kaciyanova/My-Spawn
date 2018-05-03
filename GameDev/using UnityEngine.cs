using UnityEngine;
using System.Collections;

public class ReaperOBLITERATEFUCKYOU : MonoBehaviour {
	public GameObject smoke;
	public static int breakCount=0;
	private Projectile dmg;
	private LevelManager levelManager;
	private float HP=500;
		
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
				Destroy(gameObject);
			}
		}	
	}
	

}