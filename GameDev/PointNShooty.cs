using UnityEngine;
using System.Collections;
//reaper firing
public class PointNShooty : MonoBehaviour {
	public GameObject HitSmoke;
	public GameObject attfab;
	public static int dif;
	
	void Update () {
		Shoot ();
		
	}
	
	void Shoot(){
		int shoot=Random.Range(0,dif);		
		if (shoot==0&&this.gameObject!=null){
			GameObject shot=Instantiate(attfab,transform.position,Quaternion.identity) as GameObject;
		}
		
	}
	
}