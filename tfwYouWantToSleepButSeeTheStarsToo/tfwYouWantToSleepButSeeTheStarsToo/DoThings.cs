using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class DoThings
    {
        public static bool windowClosed;
        public static bool curtainsClosed;

        public static void DoAllTheThings(Weather weather, string city)
        {
            var sunriseUTC = weather.SunriseUTC;
            var temp = weather.Temperature;
            var windspeed = weather.WindSpeed;
            var rainVolume = weather.RainVolume;
            var weatherType = weather.WeatherType;

            var today = DateTime.Today;
            var wakeUpTime = 10;
            int shiftFromUTC;

            int wakeMargin;

            if (weatherType == "sunny")
            {
                wakeMargin = 5;
            }
            else
            {
                wakeMargin = 15;
            }

            if (city == "prg")
            {
                shiftFromUTC = 2;
            }
            else if (city == "ed")
            {
                shiftFromUTC = 1;
            }
            else
            {
                shiftFromUTC = 0;
            }

            var wakeUpTimeUTC = today.AddHours(wakeUpTime + shiftFromUTC);
            
            }

        static void Morning(DateTime sunriseUTC, DateTime wakeUpTimeUTC, int wakeMargin)
        {
            if (DateTime.UtcNow >= sunriseUTC.AddMinutes(-45) && !curtainsClosed)
            {
                CloseCurtains();
            }

            if (DateTime.UtcNow >= wakeUpTimeUTC.AddMinutes(wakeMargin))
            {
                OpenCurtains();
            }
        }

        static void InclementWeather(float temp, int rainVolume, float windSpeed)
        {
            if (temp < 10 || rainVolume < 4 || windSpeed >= 10 && !windowClosed)
            {
                CloseWindow();
            }
            else if (windowClosed && temp >= 10 && rainVolume <= 4 && windSpeed < 10 && windowClosed)
            {
                OpenWindow();
            }
        }

        static void CloseCurtains()
        {
            curtainsClosed = true;
        }

        static void OpenCurtains()
        {
            curtainsClosed = false;
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
