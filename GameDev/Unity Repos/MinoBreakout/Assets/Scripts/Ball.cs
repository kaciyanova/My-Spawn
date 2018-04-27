using UnityEngine;
using System.Collections;

public class Ball : MonoBehaviour {
	private Paddle paddle;
	public Vector3 paddletoballvector;
	private bool started=false;
	private float x;
	private float y;
	public  static float v;
	public static LoseCollider reset;
	
	// Use this for initialization
	void Start () {
		paddle=GameObject.FindObjectOfType<Paddle>();
		paddletoballvector=transform.position-paddle.transform.position;		
	}
	
	// Update is called once per frame
	void FixedUpdate () {
		if (started==false){
			rigidbody2D.velocity=new Vector2(0,0);
			transform.position=paddle.transform.position+paddletoballvector;
		
			if(Input.GetMouseButton(0)){
				started=true;
				y=Random.Range (5,v-1);
				x=Mathf.Sqrt(v*v-y*(y-1));
				rigidbody2D.velocity=new Vector2(x,y);
			}
		}
	}
//anti-boring loop
	void OnCollisionEnter2D (Collision2D collision){
		Vector2 tweak=new Vector2(Random.Range(0f,-.05f),Random.Range(0f,0f));
		if (started==true){
			rigidbody2D.velocity+=tweak;
		}
	}

//ball reset on life loss
	void OnTriggerEnter2D (Collider2D trigger){
		transform.position=paddle.transform.position+paddletoballvector;
		started=false;
	}
}