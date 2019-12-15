using UnityEngine;
using System.Collections;

public class SetStartVolume : MonoBehaviour
{
    private MusicManager musicManager;

    // Use this for initialization
    void Start()
    {
        musicManager = FindObjectOfType<MusicManager>();
        if (musicManager)
        {
            float volume = PlayerPrefsManager.GetMasterVolume();
            musicManager.ChangeVolume(volume);
        }
        else
        {
            Debug.Log("no music manager found");
        }
    }

}
