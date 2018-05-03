using UnityEngine;
using System.Collections;

public class Projectile : MonoBehaviour {
	public GameObject hitSmoke;
	public float dmg=100f;//bullet damage
	//normandy bullet speed
	void FixedUpdate () {
		transform.position+=new Vector3(0,.31f);
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
