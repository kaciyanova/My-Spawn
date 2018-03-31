using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Facebook.Objects;
using Frakon.Utilities;

namespace Facebook
{
    class RateLimitRefreshWait
    {
        public void WaitForRateLimitRefresh()
        {
            Random random = new Random();
            var randomWaitMins = random.Next(55, 80);

            DateTime waitUntil = DateTime.UtcNow.AddMinutes(randomWaitMins);
            Log.Info($"Waiting for rate limit refresh until: {waitUntil}");

            var parseCompaniesWhileWaiting = true;
            while (true)
            {
                Log.Info($"Time left: {waitUntil - DateTime.UtcNow}");
                ResultUpdater.FindUnparsedInDb();

                if (parseCompaniesWhileWaiting)
                {
                    Log.Info($"Parsing companies while waiting for rate limit refresh...");
                    ResultUpdater.FindUnparsedInDb();
                    parseCompaniesWhileWaiting = false;
                }

                var randomSleepIntervalMins = random.Next(1, 10);
                Thread.Sleep(randomSleepIntervalMins * 60 * 1000);
                if (DateTime.UtcNow > waitUntil)
                {
                    waitUntil = DateTime.UtcNow.AddMinutes(randomWaitMins);
                    PublicAccessHolder.tokenIndex = 0;
                    break;
                }
            }
        }
    }
}
