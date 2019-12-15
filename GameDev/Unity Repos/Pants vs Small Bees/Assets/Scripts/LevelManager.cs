using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;


public class LevelManager : MonoBehaviour
{
    public float autoLoadNextLevelTimer;
    public bool autoLoadNextLevel;

    void Start()
    {
        if (autoLoadNextLevel && autoLoadNextLevelTimer <= 0)
        {
            Debug.LogError("Auto load next level timer is: " + autoLoadNextLevelTimer + ", please set a positive time");
        }
        else if (autoLoadNextLevel)
        {
            Invoke("loadnextlevel", autoLoadNextLevelTimer);
        }
    }

    void Update()
    {
        if (SceneManager.GetActiveScene().buildIndex == 0 && autoLoadNextLevelTimer >= 0)
        {
            if (Input.GetKeyDown(KeyCode.Escape) || Input.GetKeyDown(KeyCode.Space) || Input.GetMouseButtonDown(0) || Time.fixedTime >= autoLoadNextLevelTimer)
            {
                LoadNextLevel();
            }
        }
    }

    public void LoadLevel(string name)
    {
        Debug.Log("lvl load req for: " + name);
        SceneManager.LoadScene(name);
    }

    public void Quit()
    {
        Debug.Log("quit req");
        Application.Quit();
    }

    public void LoadNextLevel()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }
}
