using UnityEngine;
using System.Collections;

public class Defender : MonoBehaviour {
	
	
	public float walkspeed;
	// Use this for initialization
	void Start () {
		Rigidbody2D myrigidbody=gameObject.AddComponent<Rigidbody2D>();
		myrigidbody.isKinematic=true;
	}
	
	// Update is called once per frame
	void Update () {
	}
	
	void OnTriggerEnter2D(){
		Debug.Log(name+"trigger enter");
	}
}
