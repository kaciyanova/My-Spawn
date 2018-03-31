using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class WeatherGetter
    {
        public static volatile Weather Weather;

        public const string ApiKey = "&APPID=645c1c14a8b508ac4edc828eb1527bc0";

        public static void GetWeather(string currentCity)
        {
            while (true)
            {
                var weatherResult = CallApi(currentCity);

                Weather = GenerateWeatherObject(DeserialiseResult(weatherResult));

                Thread.Sleep(Program.sleepTimeIntervalMins * 60 * 1000);
            }
        }

        static string CallApi(string currentCity)
        {
            const string server = "api.openweathermap.org/data/2.5/weather?";

            var prgCoords = new Tuple<double, double>(49.9989706, 14.3668033);
            var edCoords = new Tuple<double, double>(55.9378133, -3.1839765);

            var coordinatesToUse = new Tuple<double, double>(0, 0); ;

            if (currentCity == "prg")
                coordinatesToUse = prgCoords;
            else if (currentCity == "ed")
            {
                coordinatesToUse = edCoords;
            }

            var coordinateCall = $"{server}lat={coordinatesToUse.Item1}&lon={coordinatesToUse.Item2}{ApiKey}";

            var client = new WebClient { Encoding = Encoding.UTF8 };

            var coordinateResult = client.DownloadString(coordinateCall);

            return coordinateResult;
        }

        public static WeatherResult.Rootobject DeserialiseResult(string result)
        {
            var weather = JsonConvert.DeserializeObject<WeatherResult.Rootobject>(result);
            return weather;
        }

        static Weather GenerateWeatherObject(WeatherResult.Rootobject weatherResult)
        {
            var unixEpoch = new DateTime(1970, 1, 1);

            var weather = new Weather()
            {
                SunriseUTC = unixEpoch.AddSeconds(weatherResult.sys.sunrise),
                SunsetUTC = unixEpoch.AddSeconds(weatherResult.sys.sunset),
                Temperature = weatherResult.main.temp,
                WindSpeed = weatherResult.wind.speed,
                RainVolume = weatherResult.rain._3h
            };

            return weather;
        }
    }
}
