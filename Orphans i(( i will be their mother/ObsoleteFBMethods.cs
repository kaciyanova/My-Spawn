using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Facebook.Objects;
using Frakon.Utilities;
using Newtonsoft.Json;

namespace Facebook
{
    class ObsoleteFBMethods
    {
        //                    GetLongTermTokensForUsers(new WebClient());
        //                    activeAccessTokens = db.LongTermAccessTokens
        //                                           .Where(t => AddSeconds(t.DateCreated, t.expires_in) > DateTime.Now)
        //                                           .ToList();

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

        public static void GetLongTermTokensForUsers(WebClient client)
        {
            using (var db = new CrawlerDbContextBETA())
            {
                foreach (var userInfo in db.FacebookUsers.Where(u => u.Name != "petr" && u.Name != "aelleon").ToArray())
                {
                    GetLongTermToken(userInfo, client);
                }
            }
        }

        public static LongAccessToken GetLongTermToken(User user, WebClient client)
        {
            var longAccessTokenRequest = $"https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&"
                                         + $"client_id={user.UserID}"
                                         + $"&client_secret={user.Secret}"
                                         + $"&fb_exchange_token={user.UserAccessToken} ";

            var activeAccessTokenObject =
                JsonConvert.DeserializeObject<LongAccessToken>(client.DownloadString(longAccessTokenRequest));

            activeAccessTokenObject.DateCreated = DateTime.Now; ;
            activeAccessTokenObject.user = user.Name;

            using (var db = new CrawlerDbContextBETA())
            {
                db.LongTermAccessTokens.Add(activeAccessTokenObject);
                db.SaveChanges();
            }

            return activeAccessTokenObject;
        }


        public static string SwitchAccessToken(List<LongAccessToken> activeAccessTokens)
        {
            Log.Info($"User {activeAccessTokens[PublicAccessHolder.tokenIndex].user} rate limit reached, switching to user {activeAccessTokens[PublicAccessHolder.tokenIndex + 1].user}");

            PublicAccessHolder.tokenIndex = PublicAccessHolder.tokenIndex + 1 <= activeAccessTokens.Count - 1 ? PublicAccessHolder.tokenIndex + 1 : 0;

            var activeAccessToken = activeAccessTokens[PublicAccessHolder.tokenIndex].access_token;

            return activeAccessToken;
        }

        public static string DownloadResponseAndCycleAccountsIfUnsuccessful(
            WebClient client,
            string urlToCrawlWithoutToken,
            List<LongAccessToken> activeAccessTokens)
        {
            string searchResponse = null;

            while (PublicAccessHolder.tokenIndex <= activeAccessTokens.Count - 1 && searchResponse == null)
            {
                try
                {
                    searchResponse = client.DownloadString(urlToCrawlWithoutToken + activeAccessTokens[PublicAccessHolder.tokenIndex]);
                }
                catch (Exception rateLimit) when (rateLimit.ToExceptionInfoString().Contains("400"))
                {
                    if (PublicAccessHolder.tokenIndex == activeAccessTokens.Count - 1)
                    {
                        break;
                    }
                    searchResponse =
                        client.DownloadString(urlToCrawlWithoutToken
                                              + AccessTokenManager.SwitchAccessToken(activeAccessTokens));
                }
            }
            return searchResponse;
        }
    }
}
