using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class Runners
    {
        public static void Run(string currentCity)
        {
            var weather = WeatherGetter.GetWeather(currentCity);
            DoThings.DoAllTheThings(weather, currentCity);
        }
    }
}
