using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class Fade : MonoBehaviour {
	Image image;
	public float timer;//delay
	private float incr;//increment of alpha change per frame
	private Color c;
	public bool fadeout;
	public float fadespeed;//multiple of frametime for fade
	
	void Start () {
		image = GetComponent<Image>();
		
		c = image.color;
		
		if (fadeout){
			c.a=0f;
		}
		else{
			c.a=1f;
		}
	}
	
	void Update () {
		if (fadeout){
			fadeOut();
		}
		else{
			fadeIn();
		}
	}
	
	void fadeOut(){
		incr= Time.smoothDeltaTime*fadespeed; 
		
		if (timer<=Time.time){
			c.a=c.a+incr;
			image.color=c;
		}	
	}
	
	void fadeIn(){
	
		incr= Time.smoothDeltaTime*fadespeed; 
		
		c.a=c.a-incr;
		image.color=c;
	}
}
