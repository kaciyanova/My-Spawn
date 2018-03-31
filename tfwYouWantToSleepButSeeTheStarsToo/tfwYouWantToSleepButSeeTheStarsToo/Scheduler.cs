using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class Scheduler
    {
        public static volatile Schedule schedule;

        public static void Schedule(Weather weather, string city, TimeOfDay wakeTime)
        {
            var sunriseUTC = weather.SunriseUTC;
            var weatherType = weather.WeatherType;

            var today = DateTime.Today;

            var wakeMargin = weatherType == "sunny" ? 10 : 20;

            int shiftFromUTC;
            int dawnMarginMinutes;
            switch (city)
            {
                case "prg":
                    shiftFromUTC = 2;
                    dawnMarginMinutes = 60;
                    break;
                case "ed":
                    shiftFromUTC = 1;
                    dawnMarginMinutes = 90;
                    break;
                default:
                    shiftFromUTC = 0;
                    dawnMarginMinutes = 45;
                    break;
            }

            var openCurtainUTC = today.AddHours(shiftFromUTC).AddHours(wakeTime.Hours).AddMinutes(wakeTime.Minutes).AddMinutes(-wakeMargin);

            var closeCurtainBeforeDawnUTC = sunriseUTC.AddMinutes(-dawnMarginMinutes);

            schedule.WakeTime = openCurtainUTC;
            schedule.Dawn = closeCurtainBeforeDawnUTC;

            schedule.StandbyStart = today.AddHours(wakeTime.Hours + shiftFromUTC).AddMinutes(wakeTime.Minutes + 30);
            schedule.StandbyEnd = today.AddHours(22 + shiftFromUTC);
        }
    }
}
