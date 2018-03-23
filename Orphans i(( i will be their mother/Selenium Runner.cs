using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Frakon.Utilities;
using Facebook.Objects;
using Minerva.Crawl.Browsers;
using Minerva.Crawl.Browsers.WebPageConditions;
using Minerva.Crawl.Crawlers.PageNavigators;
using Minerva.Crawl.Proxy;
using OpenQA.Selenium;
using Petr.Utilities;

namespace Facebook
{
    class Selenium_Runner
    {
        private static SafeExtendedSeleniumBrowser browser;

        static Selenium_Runner()
        {
            browser = new SafeExtendedSeleniumBrowser
            {
                InnerBrowser = { ProxySwitcher = new FirmyCzProxySwitcher1000(0, 1) }
            };
        }

        public static void WebPageLoader()
        {
            var tokenPage =
                "https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=&version=v2.11";

            browser.DownloadWebPage("about:blank");
            browser.DownloadWebPage(tokenPage);

            //browser.InnerBrowser.CloseExistingWindowAndResetBrowser();

            

            browser.DoAction(webDriver =>
                                                 {
                                                     webDriver.FindElement(By.XPath("//a[text()='Log In']")).Click();
                                                    });
            browser.DoAction(webDriver =>
            {
                webDriver.FindElement(By.Id("email")).SendKeys("accio.tardis11@gmail.com");
                webDriver.FindElement(By.Id("pass")).SendKeys("deusexbizmachina");
                webDriver.FindElement(By.Id("loginbutton")).Click();
            });

            browser.DoAction(webDriver =>
            {
                webDriver.FindElement(By.XPath("//span[text()='Get Token']")).Click();
                webDriver.FindElement(By.XPath("//button[@class='_4jy0 _4jy3 _4jy1 _51sy selected _42ft']")).Click();
            });

            browser.DoAction(webDriver =>
            {
                webDriver.FindElement(By.XPath("//button[@name='__CONFIRM__']")).Click();
                webDriver.FindElement(By.XPath("//button[@class='_4jy0 _4jy3 _4jy1 _51sy selected _42ft']")).Click();
            });
            
            browser.DoAction(webDriver =>
          {
              Task.Factory.StartNew(() => browser.DownloadWebPage(tokenPage));
          });

            var item = browser.InnerBrowser.GetCurrentWebPageItem();
            try
            {
                browser.DoAction(webDriver =>
                                 {
                                     Task.Factory.StartNew(() => browser.DownloadWebPage(tokenPage));
                                 },
                                 new WebPageCondition[]
                                 {
//           OrWebPageCondition.CreateNotThrowingException("//div[contains(@class,'fac-box fac-opening-time')]",
//            "//h2[contains(.,'502')]",
//            "//a[@data-name='contactPhoneDialog']")
                                 });
            }
            catch (Exception ex)
            {
                Log.Info("" + ex);
            }

//
//                    static string ContactsClicker(WebPageItem page)
//                    {
//                        string phone = null;
//                        try
//                        {
//                            browser.DoAction(webDriver =>
//                            {
//                                var getTokenButton = webDriver.FindElement(By.XPath("//span[text()='Get Token']"));
//                                getTokenButton.Click();
//                            }, "//div[@class='fac-contact-phone']");
//            
//                            if (item.HtmlNode.SelectSingleNode("//span[text()='Get User Access Token']")
//                                var currentWebItem = browser.InnerBrowser.GetCurrentWebPageItem();
//            
//                            var phoneNode = currentWebItem.HtmlNode.SelectSingleNode(
//                                "//div[@class='fac-contact-phone']//tr[td[1]/text()='Telefon:']/td[2]/strong");
//            
//                            phone = phoneNode.InnerText;
//            
//                            //                browser.InnerBrowser.CloseExistingWindowAndResetBrowser();
//                        }
//                        catch (Exception ex)
//                        {
//                            Log.Info("exception on " + page + " " + ex);
//                        }
//                        return phone;
//                    }
        }
    }
}
