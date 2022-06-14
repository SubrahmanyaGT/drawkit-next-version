import parseHtml, { domToReact } from "html-react-parser";
import React, { useState, useEffect } from "react";
import MainWrapper from "./mainwrapper";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import NavbarContent from "./navbar";
import Script from "next/script";
import $ from "jquery";
import Head from "next/head";
import { replace } from "../utils/replace-node";

export default function Home(props) {
  let [headContent, setheadContent] = useState(props.headContent);
  let [navBar, setnavbar] = useState(props.navBar);
  let [auth, setAuth] = useState(supabase.auth.user());
  let [blog, setBlog] = useState(props.showBlog);
  let [illusHead, setIllusHead] = useState(props.illustrationHead);
  let [illusHeadLogin, setIllusHeadLogin] = useState("");
  let [showFree, setShowfree] = useState(props.showFree);
  let [PremiumUser, setPremiumUser] = useState("inactive");
  let [hideLogin, setHideLogin] = useState(props.hideLogin);
  let [supportScripts, setsupportScripts] = useState(props.supportScripts);

  /** ..................................................................................................................................*/
  const parseOptions = { replace };
  /** ..................................................................................................................................*/
  if (supabase.auth.session()) {
    let uid = supabase.auth.session().user.id;
    supabase
      .from("stripe_users")
      .select("stripe_user_id")
      .eq("user_id", uid)
      .then(({ data, error }) => {
        fetch("api/check-active-status", {
          method: "POST",
          headers: {
            contentType: "application/json",
          },
          body: JSON.stringify({ customer: data[0].stripe_user_id }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            setPremiumUser(data.status);
          });
      });
  }
  console.log(PremiumUser);

  useEffect(() => {
    $(".request").click(function () {
      $(".request-popup").show();
      setTimeout(function () {
        $("#loader").hide();
        $(".iframe-holder").show();
      }, 3000);
    });
    $(".cancel,.request-popup").click(function () {
      $(".request-popup").hide();
      $("#loader").show();
      $(".iframe-holder").hide();
    });

    $("input:not([type=checkbox],[type=submit]),textarea")
      .focus(function () {
        $(this).parent().css({ border: "1px solid #1aa1e5" });
      })
      .blur(function () {
        $(this).parent().css({ border: "1px solid #ccd1d6" });
      });

    window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";
    (function (d) {
      var s = d.createElement("script");
      s.src = "https://cdn.jetboost.io/jetboost.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })(document);
    if (!supabase.auth.session()) {
      setHideLogin(props.hideLogin);
      setBlog("");
    } else {
      setHideLogin("");
      setBlog(props.showBlog);
      setIllusHead("");
      setnavbar(props.LoggedinnavBar);
      setIllusHeadLogin(props.illustrationHeadLogin);
      if (PremiumUser == "active") {
        setShowfree("");
      }
    }
    //my profile dropdown
  }, []);
  return (
    <>
      <Head>
        {parseHtml(headContent, parseOptions)}

        {parseHtml(supportScripts, parseOptions)}
      </Head>
      <NavbarContent navbarContent={parseHtml(navBar, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(hideLogin, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(illusHeadLogin, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(illusHead, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(props.HomeIllustration, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(showFree, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(props.showcase, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(blog, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(props.allShow, parseOptions)} />
      {parseHtml(props.footer, parseOptions)}
      {parseHtml(props.globalStyles, parseOptions)}
    </>
  );
}

/** data fetching  from w-drawkit site*/
export async function getServerSideProps() {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const webUrl = "https://drawkit-v2.webflow.io/";
  const res = await axios(webUrl);
  const html = res.data;
  const $ = cheerio.load(html);

  const supportScripts = Object.keys($(`script`))
    .map((key) => {
      if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    })
    .filter((src) => {
      if (src) return src;
    })
    .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
    .join("")
    .toString();
  const navBar = $(".navbar").html();
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
    props: {
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
}
