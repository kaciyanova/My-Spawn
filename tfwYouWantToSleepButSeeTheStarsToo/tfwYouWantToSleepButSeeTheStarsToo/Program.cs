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
        static void Main(string[] args)
        {
            Task window = Task.Factory.StartNew(() => DoThings("window"));

            while (true)
            {
                Thread.Sleep(10 * 60 * 1000);
                Runners.WindowController("prg");
                Runners.CurtainController("prg");
            }
        }
    }
}
