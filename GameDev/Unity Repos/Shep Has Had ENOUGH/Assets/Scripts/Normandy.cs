using UnityEngine;
using System.Collections;

public class Normandy : MonoBehaviour {
	public GameObject pewfab;
	private float timer;
	public float normandyspeed;
	public GameObject smoke;
	public int shipHP;
	private Projectile dmg;
	private AudioClip pewsound;
	private AudioClip lifelose;
	
	void Start(){
		shipHP=1000;
		
	}
	
	void smokePuff(){
		GameObject Smoke = Instantiate(smoke,gameObject.transform.position,Quaternion.identity) as GameObject;
		Smoke.particleSystem.startColor=gameObject.GetComponent<SpriteRenderer>().color;
	}
	
	void OnTriggerEnter2D(Collider2D collider){
		ReaperProjectile braaap=collider.gameObject.GetComponent<ReaperProjectile>();
		if (braaap){
			shipHP-=braaap.dmg;
			braaap.Hit();
			lifelose=(AudioClip)Resources.Load ("lifelose");
			AudioSource.PlayClipAtPoint(lifelose,transform.position,.5f);
			
			if (shipHP<=0){
				smokePuff();	
			}
		}
	}
	
	// Update is called once per frame
	void FixedUpdate () {
			Move();
			Shoot();
			}
	
	//fire rate	
	void Shoot(){
		float fireRate=.27f;
		
		if (Input.GetKeyUp(KeyCode.Space)||Input.GetMouseButton(1)){
			timer=0;
		}
		
		if (timer<=0 && Input.GetKey(KeyCode.Space)||timer<=0 && Input.GetMouseButton(0)){
			//print ("pew");
			timer=fireRate;
			GameObject pew=Instantiate(pewfab,transform.position,Quaternion.identity) as GameObject;//bullet gen
			pewsound=(AudioClip)Resources.Load ("pewsound");
			AudioSource.PlayClipAtPoint(pewsound,transform.position,.15f);
			
			
		}
		else{
			timer-=Time.deltaTime;
		}
		
		
	}
	
	void Move(){
		Vector3 shipPos=new Vector3(transform.position.x,transform.position.y,0f);
		
		//ship border
		shipPos.x=Mathf.Clamp((shipPos.x),.3f,8.7f);
		shipPos.y=Mathf.Clamp((shipPos.y),.6f,15.4f);
		
		//ship movement controls
		if (Input.GetKey(KeyCode.UpArrow)||Input.GetKey(KeyCode.W)){
			shipPos+=new Vector3(0f,.1f*normandyspeed,0f);
			}
		if (Input.GetKey(KeyCode.DownArrow)||Input.GetKey(KeyCode.S)){
			shipPos+=new Vector3(0f,-.1f*normandyspeed,0f);
			}
		if (Input.GetKey(KeyCode.LeftArrow)||Input.GetKey(KeyCode.A)){
			shipPos+=new Vector3(-0.1f*normandyspeed,0f,0f);
			}
		if (Input.GetKey(KeyCode.RightArrow)||Input.GetKey(KeyCode.D)){
			shipPos+=new Vector3(0.1f*normandyspeed,0f,0f);
			}
		transform.position=shipPos;
	}
}
