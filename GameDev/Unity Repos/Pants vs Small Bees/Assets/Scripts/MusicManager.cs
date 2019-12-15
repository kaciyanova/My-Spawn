using UnityEngine;
using System.Collections;

public class MusicManager : MonoBehaviour
{
    public AudioClip[] levelAudioArray;
    public AudioSource music;
    public bool loopMusic = true;

    void Awake()
    {
        DontDestroyOnLoad(gameObject);
    }

    void Start()
    {
        music = GetComponent<AudioSource>();
        Debug.Log("Audio source: " + music);
    }

    public void ChangeVolume(float volume)
    {
        music.volume = volume;
    }

    void OnLevelWasLoaded(int level)
    {
        Debug.Log("Playing audio: " + levelAudioArray[level]);

        AudioClip levelMusic = levelAudioArray[level];

        if (levelMusic && levelMusic != music.clip)
        {
            music.clip = levelMusic;
            music.loop = loopMusic;
            music.Play();
        }
    }
}
