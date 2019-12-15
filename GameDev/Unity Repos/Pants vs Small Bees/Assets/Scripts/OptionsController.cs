using UnityEngine;
using System.Collections;
using UnityEngine.UI;
public class OptionsController : MonoBehaviour
{
    public Slider volumeSlider, difficultySlider;
    public LevelManager levelManager;
    public Text currentDifficulty;

    private MusicManager musicManager;

    // Use this for initialization
    void Start()
    {
        musicManager = FindObjectOfType<MusicManager>();
        volumeSlider.value = PlayerPrefsManager.GetMasterVolume();
        difficultySlider.value = PlayerPrefsManager.GetDifficulty();
        //currentDifficulty = FindObjectOfType<Text>();
    }

    // Update is called once per frame
    void Update()
    {
        musicManager.ChangeVolume(volumeSlider.value);

        if (difficultySlider.value == 1)
        {
            currentDifficulty.text = "Easy";
            Debug.Log("ez");
        }
        else if (difficultySlider.value == 2)
        {
            currentDifficulty.text = "Medium";
        }
        else if (difficultySlider.value == 3)
        {
            currentDifficulty.text = "Hard";
        }
        else if (difficultySlider.value == 4)
        {
            currentDifficulty.text = "Hardcore";
        }
        else if (difficultySlider.value == 5)
        {
            currentDifficulty.text = "W H Y";
        }
    }

    public void SaveSettingsAndExit()
    {
        PlayerPrefsManager.SetMasterVolume(volumeSlider.value);
        PlayerPrefsManager.SetDifficulty(difficultySlider.value);

        var menu = "10 Menu";

        Debug.Log("loading level: " + menu);
        levelManager.LoadLevel(menu);
    }

    public void SetDefaults()
    {
        volumeSlider.value = .5f;
        difficultySlider.value = 2;
    }
}
