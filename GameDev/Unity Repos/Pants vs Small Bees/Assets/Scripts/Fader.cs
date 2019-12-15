using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class Fader : MonoBehaviour
{
    Image image;
    public float fadeDelay;
    public bool shouldFadeOut;
    public float fadeSpeed;

    float transparencyChangePerFrame;
    Color colour;

    void Start()
    {
        image = GetComponent<Image>();

        colour = image.color;

        if (shouldFadeOut)
        {
            colour.a = 0;
        }
        else
        {
            colour.a = 1;
        }
    }

    void Update()
    {
        if (shouldFadeOut)
        {
            FadeOut();
        }
        else
        {
            FadeIn();
        }
    }

    void FadeOut()
    {
        transparencyChangePerFrame = Time.smoothDeltaTime * fadeSpeed;

        if (fadeDelay <= Time.time)
        {
            colour.a = colour.a + transparencyChangePerFrame;
            image.color = colour;
        }
    }

    void FadeIn()
    {

        transparencyChangePerFrame = Time.smoothDeltaTime * fadeSpeed;

        colour.a = colour.a - transparencyChangePerFrame;
        image.color = colour;
    }
}
