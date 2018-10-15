using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class Program
    {
      public static volatile int sleepTimeIntervalMins;

        static void Main(string[] args)
        {
            

            var city = "prg";
            var wakeTime = new TimeOfDay { Hours = 9, Minutes = 30 };

           Scheduler.Schedule(WeatherGetter.Weather, city, wakeTime);

            Task getWeather = Task.Factory.StartNew(() => WeatherGetter.GetWeather(city));
            Task window = Task.Factory.StartNew(() => WindowController.CheckWeather(WeatherGetter.Weather));
            Task curtains = Task.Factory.StartNew(CurtainController.CheckTime);

            getWeather.Start();
            window.Start();
            curtains.Start();

            while (true)
            {
                if (DateTime.UtcNow >= Scheduler.schedule.StandbyStart && DateTime.UtcNow < Scheduler.schedule.StandbyEnd)
                {
                    sleepTimeIntervalMins = 60;
                }
                else
                {
                    sleepTimeIntervalMins = 10;
                }
                Thread.Sleep(10 * 60 * 1000);
            }
        }
    }
}
