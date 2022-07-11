import parseHtml, { domToReact } from "html-react-parser";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import NavbarContent from "./navbar";
import Script from "next/script";
import $ from "jquery";
import Head from "next/head";
import { replace } from "../utils/replace-node";
import { useRouter } from "next/router";

export default function Home(props) {
  let [auth, setAuth] = useState(supabase.auth.session());
  let [headContent, setheadContent] = useState(props.headContent);
  let [navBar, setnavbar] = useState(props.navBar);
  let [blog, setBlog] = useState(props.showBlog);
  let [illusHead, setIllusHead] = useState(props.illustrationHead);
  let [illusHeadLogin, setIllusHeadLogin] = useState("");
  let [showFree, setShowfree] = useState(props.showFree);
  let [PremiumUser, setPremiumUser] = useState("inactive");
  let [hideLogin, setHideLogin] = useState(props.hideLogin);
  let [supportScripts, setsupportScripts] = useState(props.supportScripts);

  const router = useRouter()
  

  const parseOptions = {
    replace,
  };
  // if (supabase.auth.session()) {
  //   let uid = supabase.auth.session().user.id;
  //   supabase
  //     .from("stripe_users")
  //     .select("stripe_user_id")
  //     .eq("user_id", uid)
  //     .then(({ data, error }) => {
  //       fetch("api/check-active-status", {
  //         method: "POST",
  //         headers: {
  //           contentType: "application/json",
  //         },
  //         body: JSON.stringify({ customer: data[0].stripe_user_id }),
  //       })
  //         .then(function (response) {
  //           return response.json();
  //         })
  //         .then(function (data) {
  //           setPremiumUser(data.status);
  //         });
  //     });
  // }





  // (async()=>{console.log(supabase.auth.session().access_token,);
  // console.log(await supabase.auth.verifyOTP({
  //   email:'subrahmanyagt@gmail.com',
  //   token:supabase.auth.session.access_token,
  //   type:'magiclink',
  // }))})()

  return (
    <>
      {/* <div onLoad={jetboosthome}> */}

      {auth == null ? parseHtml(hideLogin, parseOptions) : null}
      {auth == null
        ? parseHtml(illusHeadLogin, parseOptions)
        : parseHtml(props.illustrationHeadLogin, parseOptions)}

      {auth == null ? parseHtml(illusHead, parseOptions) : null}
      {auth == null ? (
        parseHtml(props.HomeIllustration, parseOptions)
      ) : (
        <div className="l">
          {parseHtml(props.HomeIllustration, parseOptions)}
        </div>
      )}
      {parseHtml(showFree, parseOptions)}
      {auth == null ? (
        <div className="showCaseBeforLogin">
          {parseHtml(props.showcase, parseOptions)}
        </div>
      ) : (
        <div className="showCaseAfterLogin">
          {parseHtml(props.showcase, parseOptions)}
        </div>
      )}

      {auth == null ? null : parseHtml(blog, parseOptions)}
      {parseHtml(props.allShow, parseOptions)}
      {/* </div> */}
      {/* <Script strategy="lazyOnload" id="jetboost-script" type="text/javascript" src='https://cdn.jetboost.io/jetboost.js' async  onError={(e) => {
          console.error('Script failed to load', e)
        }}></Script> */}

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
