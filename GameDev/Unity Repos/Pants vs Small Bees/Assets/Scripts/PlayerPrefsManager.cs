using UnityEngine;
using System.Collections;

public class PlayerPrefsManager : MonoBehaviour
{
    const string MASTERVOLUMEKEY = "mastervolume";//keys all caps
    const string DIFFICULTYKEY = "difficulty";
    const string LEVELKEY = "levelunlocked_";//eg levelunlocked_2

    public static void SetMasterVolume(float vol)
    {
        if (vol >= 0 && vol <= 1)
        {
            PlayerPrefs.SetFloat(MASTERVOLUMEKEY, vol);
        }
        else
        {
            Debug.LogError("master volume out of range (must be 0-1)");
        }
    }

    public static float GetMasterVolume()
    {
        return PlayerPrefs.GetFloat(MASTERVOLUMEKEY);
    }

    public static void UnlockLevel(int level)
    {
        if (level <= Application.levelCount - 1)
        {
            PlayerPrefs.SetInt(LEVELKEY + level.ToString(), 1);
        }
        else
        {
            Debug.LogError("level not in build order");
        }
    }

    public static bool LevelUnlocked(int level)
    {
        int levelVal = PlayerPrefs.GetInt(LEVELKEY + level.ToString());
        bool levelUnlocked = (levelVal == 1);

        if (level <= Application.levelCount - 1)
        {
            return levelUnlocked;
        }
        else
        {
            Debug.LogError("queried level not in build order");
            return false;
        }
    }

    public static void SetDifficulty(float difficulty)
    {
        if (difficulty >= 1 && difficulty <= 5)
        {
            PlayerPrefs.SetFloat(DIFFICULTYKEY, difficulty);
        }
        else
        {
            Debug.LogError("difficulty out of range (must be 0<diff)");

        }
    }

    public static float GetDifficulty()
    {
        return PlayerPrefs.GetFloat(DIFFICULTYKEY);
    }
}



