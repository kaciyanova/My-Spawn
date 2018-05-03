using UnityEngine;
using System.Collections;

public class ReaperProjectile : MonoBehaviour {
	public GameObject hitSmoke;
	public int dmg=100;//bullet damage
	
	// Update is called once per frame
	void FixedUpdate () {
		transform.position+=new Vector3(0,-.15f);
	}
	
	public float GetDmg(){
		return dmg;//spits out damage for subtracting from reaper life
	}
	
	public void Hit(){
		hitPuff();
		Destroy(gameObject);//destroys bullet 
	}
	
	public void hitPuff(){
		hitSmoke = Instantiate(hitSmoke,gameObject.transform.position,Quaternion.identity) as GameObject;
		hitSmoke.particleSystem.startColor=gameObject.GetComponent<SpriteRenderer>().color;
	}
	
}
