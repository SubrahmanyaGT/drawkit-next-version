import "../styles/globals.css";
// import App from 'next/app'
import NavbarContent from "./navbar";
import { replace } from "../utils/replace-node";
import parseHtml, { domToReact } from "html-react-parser";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LogRocket from "logrocket";
import { ThemeProvider } from "../lib/authInfo";
import { supabase } from "../utils/supabaseClient";
import InitUser from "./authComponent";

LogRocket.init("p5qzuw/drawkit-test");

function MyApp(props) {
  const [loading, setLoading] = useState(true);
  const { Component, pageProps } = props;
  const parseOptions = {
    replace,
  };
  const router = useRouter();

  useEffect(() => {
    console.log(router);
    if (typeof Jetboost !== "undefined") {
      Jetboost = null;
    }

    if (typeof window !== "undefined") {
      window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";

      (function (d) {
        var s = d.createElement("script");
        s.src = "https://cdn.jetboost.io/jetboost.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);

        d.getElementsByTagName("head")[0].removeChild(s);
      })(document);

      ((d) => {
        d.querySelectorAll(".nav-menu .w--open").forEach((el) => {
          el.classList.remove("w--open");
        });
      })(document);
    }
  }, [router.pathname, router.query]);
  let navLayoutStyle = {};
  if (Component.getLayout) {
    navLayoutStyle = { display: "none" };
  }

  return (
    <> <Head>
              {parseHtml(props.stars.globalStyles, parseOptions)}
              {parseHtml(props.stars.headContent, parseOptions)}
              {parseHtml(props.stars.supportScripts, parseOptions)}
            </Head>
      <ThemeProvider>
        <InitUser setLoading={setLoading} />
        {loading ? (
          <div className="loadingContainer">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <>
           
            <div style={navLayoutStyle}>
              <NavbarContent
                navbarContent={parseHtml(props.stars.navBar, parseOptions)}
              />
            </div>

            <Component {...pageProps} />

            <div style={navLayoutStyle}>
              {parseHtml(props.stars.footer, parseOptions)}
            </div>
            {parseHtml(props.stars.globalStyles, parseOptions)}
          </>
        )}
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async (ctx) => {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const webUrl = "https://drawkit-v2.webflow.io/new-test";
  const res = await axios(webUrl);
  const html = res.data;
  const $ = cheerio.load(html);

  const supportScripts = Object.keys($(`body script`))
    .map((key) => {
      if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    })
    .filter((src) => {
      if (src) return src;
    })
    .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
    .join("")
    .toString();
  console.log("supportScripts", $(`body script`));
  const navBar = $(".nav-access").html();
  const globalStyles = $(".global-styles").html();
  const LoggedinnavBar = $(`.logged-in-user-nav`).html();
  const hideLogin = $(`.hide-login`).html();
  const homeIllustration = $(`.show-all-illustration`).html();
  const showFree = $(`.show-free`).html();
  const showcase = $(`.showcase`).html();
  const illustrationHeadLogin = $(`.after-login-heading`).html();
  const illustrationHead = $(".before-login-heading").html();
  const showBlog = $(`.show-blogs-login`).html();
  const allShow = $(`.show-all`).html();
  const headContent = $(`head`).html();
  const footer = $(`.footer-access`).html();

  return {
    stars: {
      headContent: headContent,
      globalStyles: globalStyles,
      supportScripts: supportScripts,
      navBar: navBar,
      hideLogin: hideLogin,
      LoggedinnavBar: LoggedinnavBar,
      footer: footer,
      showFree: showFree,
      showcase: showcase,
      showBlog: showBlog,
      illustrationHeadLogin: illustrationHeadLogin,
      illustrationHead: illustrationHead,
      HomeIllustration: homeIllustration,
      showFree: showFree,
      allShow: allShow,
    },
  };
};
export default MyApp;
