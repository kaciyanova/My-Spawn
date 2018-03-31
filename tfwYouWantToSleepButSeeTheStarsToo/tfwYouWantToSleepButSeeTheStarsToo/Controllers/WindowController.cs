using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class WindowController
    {
        public static bool windowClosed;

        public static void CheckWeather(Weather weather)
        {
            while (true)
            {
                var temp = weather.Temperature;
                var windSpeed = weather.WindSpeed;
                var rainVolume = weather.RainVolume;

                if (temp < 10 || rainVolume < 4 || windSpeed >= 10 && !windowClosed)
                {
                    CloseWindow();
                }
                else if (windowClosed && temp >= 10 && rainVolume <= 4 && windSpeed < 10 && windowClosed)
                {
                    OpenWindow();
                }
                Thread.Sleep(Program.sleepTimeIntervalMins * 60 * 1000);
            }
        }

        static void CloseWindow()
        {
            windowClosed = true;

        }

        static void OpenWindow()
        {
            windowClosed = false;
        }
    }
}
