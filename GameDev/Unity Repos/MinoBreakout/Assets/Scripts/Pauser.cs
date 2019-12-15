using UnityEngine;
using System.Collections;

public class Pauser : MonoBehaviour
{
	GameObject [] pause;
	public bool paused;

	// Use this for initialization
	void Start ()
	{
		pause = GameObject.FindGameObjectsWithTag ("ShowOnPause");
		HidePausedElements ();
		paused = false;
	}

	void Update ()
	{
		if (Input.GetKeyDown (KeyCode.Space) || Input.GetKeyDown (KeyCode.Escape)) {
			paused = !paused;
			if (paused) {
				Time.timeScale = 0;
				//print ("paused");
				ShowPausedElements ();

			} else if (!paused) {
				Time.timeScale = 1;
				//print ("unpaused");
				HidePausedElements ();

			}
		}
	}


	public void Pause ()
	{
		if (Time.timeScale == 1) {
			Time.timeScale = 0;
			ShowPausedElements ();
		} else if (Time.timeScale == 0) {
			Time.timeScale = 1;
			HidePausedElements ();
		}
	}


	public void ShowPausedElements ()
	{
		foreach (GameObject g in pause) {
			g.SetActive (true);

		}
	}

	public void HidePausedElements ()
	{
		foreach (GameObject g in pause) {
			g.SetActive (false);

		}
	}

}