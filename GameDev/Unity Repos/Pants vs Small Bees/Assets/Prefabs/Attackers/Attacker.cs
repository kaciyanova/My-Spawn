 using UnityEngine;
using System.Collections;

public class Attacker : MonoBehaviour {
	
	[Range(-1f,2f)]
	public float currentSpeed;
	// Use this for initialization
	void Start () {
		Rigidbody2D myrigidbody=gameObject.AddComponent<Rigidbody2D>();
		myrigidbody.isKinematic=true;
	}
	
	// Update is called once per frame
	void Update () {
		transform.Translate(Vector3.left*currentSpeed*Time.deltaTime);
	}
	
	void OnTriggerEnter2D(){
		Debug.Log(name+"trigger enter");
	}
	
	public void SetSpeed(float speed){
		currentSpeed=speed;
	}
	
	public void StrikeCurrentTarget(float dmg){
		Debug.Log(name+" hits for "+dmg+" damage");
	}
}
