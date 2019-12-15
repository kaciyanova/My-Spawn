using UnityEngine;
using System.Collections;

public class Defender : MonoBehaviour
{


    //public float walkSpeed;
    // Use this for initialization
    void Start()
    {
        Rigidbody2D rigidBody = gameObject.AddComponent<Rigidbody2D>();
        rigidBody.isKinematic = true;
    }

    // Update is called once per frame
    void Update()
    {
    }

    void OnTriggerEnter2D()
    {
        Debug.Log(name + " TRIGGERED");
    }
}
