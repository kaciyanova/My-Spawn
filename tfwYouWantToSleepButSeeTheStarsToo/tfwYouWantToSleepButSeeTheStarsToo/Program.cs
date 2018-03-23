using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class Program
    {
        static void Main(string[] args)
        {
            var weather=WeatherGetter.GetWeather();
            DoThings.DoAllTheThings(weather);
        }
    }
}
