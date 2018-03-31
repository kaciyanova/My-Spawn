using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace tfwYouWantToSleepButSeeTheStarsToo
{
    class CurtainController
    {
        public static bool curtainsClosed;

        public static void CheckTime()
        {
            while (true)
            {
                if (DateTime.UtcNow >= Scheduler.schedule.Dawn && !curtainsClosed)
                {
                    CloseCurtains();
                }

                if (DateTime.UtcNow >= Scheduler.schedule.WakeTime)
                {
                    OpenCurtains();
                }

                if (Program.sleepTimeIntervalMins > 10)
                {
                    Thread.Sleep(Program.sleepTimeIntervalMins * 60 * 1000);
                }
                else
                {
                    Thread.Sleep(60 * 1000);
                }
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
    }
}
