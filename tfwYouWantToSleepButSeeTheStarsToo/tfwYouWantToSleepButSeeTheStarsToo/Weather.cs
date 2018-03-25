using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class Weather
    {
        public DateTime SunriseUTC { get; set; }
        public DateTime SunsetUTC { get; set; }

        public float Temperature { get; set; }

        public float WindSpeed { get; set; }

        public int RainVolume { get; set; }

        public string WeatherType { get; set; }
    }
}
