using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class WeatherGetter
    {
        public const string apiKey = "&APPID=645c1c14a8b508ac4edc828eb1527bc0";

        public static Weather GetWeather(string currentCity)
        {
            var weatherResult = CallApi(currentCity);

            var weather = MakeWeatherObject(DeserialiseResult(weatherResult));

            return weather;
        }

        static string CallApi(string currentCity)
        {
            var server = "api.openweathermap.org/data/2.5/weather?";

            var prgPostcode = 15300;
            var edPostcode = "EH91NN";

            var czCountryCode = "cz";
            var ukCountryCode = "uk";

            var prgCity = "prague";
            var edCity = "edinburgh";

            var prgCoords = new Tuple<double, double>(49.9989706, 14.3668033);
            var edCoords = new Tuple<double, double>(55.9378133, -3.1839765);

            //            var postcodeCall = $"{server}zip={prgPostcode},{czCountryCode}{apiKey}";
            //            var cityCall = $"{server}q={prgCity}{apiKey}";


            var coordinatesToUse= new Tuple<double, double>(0, 0); ;

            if (currentCity == "prg")
            {
                coordinatesToUse = prgCoords;
            }
            else if (currentCity == "ed")
            {
                coordinatesToUse = edCoords;
            }
       
            var coordinateCall = $"{server}lat={coordinatesToUse.Item1}&lon={coordinatesToUse.Item2}{apiKey}";

            var client = new WebClient { Encoding = Encoding.UTF8 };

            //            var postcodeResult = client.DownloadString(postcodeCall);

            //            var cityResult = client.DownloadString(cityCall);

            var coordinateResult = client.DownloadString(coordinateCall);

            return coordinateResult;
        }

        public static WeatherResult.Rootobject DeserialiseResult(string result)
        {
            var weather = JsonConvert.DeserializeObject<WeatherResult.Rootobject>(result);
            return weather;
        }

        static Weather MakeWeatherObject(WeatherResult.Rootobject weatherResult)
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
