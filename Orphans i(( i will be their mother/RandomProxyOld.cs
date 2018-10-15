using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Frakon.Utilities;
using Minerva.Crawl.Proxy;

namespace TripAdvisor
{
    static class RandomProxyOld
    {
        static readonly Random Random = new Random();

        public static string GetRandomProxyWithoutFrakon()
        {
            var proxyPath = $"..\\..\\..\\..\\..\\MinervaLibs\\Minerva.Crawl\\Proxy\\ProxyLists\\";
            var proxyFile = "fineproxy_1000.txt";
            var proxyList = ConvertProxyFileToList(proxyPath, proxyFile);
            var randomIndex = Random.Next(proxyList.Length);

            var proxy = proxyList[randomIndex].Replace("\r", "");

            return proxy;
        }

        public static string GetRandomProxy()
        {
            var proxyPath = $"..\\..\\..\\..\\..\\MinervaLibs\\Minerva.Crawl\\Proxy\\ProxyLists\\";
            var proxyFile = "fineproxy_1000.txt";
            var proxyList = ConvertProxyFileToList(proxyPath, proxyFile);
            var randomIndex = Random.Next(proxyList.Length);

            //            return proxy;
        }

        private static string[] ConvertProxyFileToList(string proxyPath, string proxyFile)
        {
            var proxyString = File.ReadAllText($"{proxyPath}{proxyFile}");
            var proxyList = proxyString.SplitToNonEmptyLines();

            return proxyList;
        }
    }
}
