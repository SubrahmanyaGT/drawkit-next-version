// import { prop } from "cheerio/lib/api/attributes";
import parseHtml, { domToReact } from "html-react-parser";
import React, { useState, useEffect } from "react";
import MainWrapper from "./mainwrapper";
import get from "lodash/get";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import NavbarContent from "./navbar";
import Script from "next/script";
import $ from "jquery";
import Head from "next/head";
import { prop } from "cherio/lib/api/attributes";
import dynamic from "next/dynamic";
// const NavbarContent=dynamic(() => import("./navbar"), { ssr: false })
function isUrlInternal(link) {
  if (
    !link ||
    link.indexOf(`https:`) === 0 ||
    link.indexOf(`#`) === 0 ||
    link.indexOf(`http`) === 0 ||
    link.indexOf(`://`) === 0
  ) {
    return false;
  }
  return true;
}

// Replaces DOM nodes with React components
function replace(node) {
  const attribs = node.attribs || {};
  if (attribs.hasOwnProperty("class")) {
    attribs["className"] = attribs["class"];
  }

  // Replace links with Next links
  if (node.name === `a`) {
    const { href, style, ...props } = attribs;
    //
    if (!style && href) {
      // if(props.class.includes("upgrade-plan-link")){
      // if(node.children[2])
      // console.log(node.children[2].children[0].data);
      return (
        <Link href={href}>
          <a {...props}>
            {!!node.children &&
              !!node.children.length &&
              domToReact(node.children, parseOptions)}
            {/* Download */}
          </a>
        </Link>
      );
      // }
      return (
        <Link href={href}>
          <a {...props}>
            {!!node.children &&
              !!node.children.length &&
              domToReact(node.children, parseOptions)}
          </a>
        </Link>
      );
    }
    if (href) {
    }
  }

  // Make Google Fonts scripts work
  if (node.name === `script`) {
    let content = get(node, `children.0.data`, ``);
    if (content && content.trim().indexOf(`WebFont.load(`) === 0) {
      content = `setTimeout(function(){${content}}, 1)`;
      return (
        <script
          {...attribs}
          dangerouslySetInnerHTML={{ __html: content }}
        ></script>
      );
    }
  }
  const { href, style, ...props } = attribs;
  // if (props.className) {

  //   console.log(props.className.includes('illustration-heading')?props.className:'');
  //   if (props.class.includes('illustration-heading')) {
  //     return (
  //       <div className="buttons" >
  //         Log Out
  //       </div>
  //     );
  //   }
  // }
}
const parseOptions = { replace };

export default function Home(props) {
  let [headContent, setheadContent] = useState(props.headContent);
  let [navBar, setnavbar] = useState(props.navBar);
  let [auth, setAuth] = useState(supabase.auth.user());

  let [hideLogin, setHideLogin] = useState(props.hideLogin);
  let [supportScripts, setsupportScripts] = useState(props.supportScripts);
  //  console.log(props.supportScripts);

  // useEffect(()=>{
  //   if (supabase.auth.session()) {

  //     setnavbar(props.LoggedinnavBar);
  //     }
  // },[])

  return (
    <>
      <Head>
        {parseHtml(headContent, parseOptions)}
        {parseHtml(props.globalStyles, parseOptions)}
      </Head>
      <NavbarContent
        navbarContent={parseHtml(navBar, parseOptions)}
        scripts={parseHtml(supportScripts, parseOptions)}
        
      />

      <MainWrapper mainWrap={parseHtml(hideLogin, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(props.HomeIllustration, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(props.premiumHide, parseOptions)} />
      <MainWrapper mainWrap={parseHtml(props.allShow, parseOptions)} />
      {parseHtml(props.footer, parseOptions)}
      {parseHtml(supportScripts, parseOptions)}
    </>
  );
}

/** data fetching  from w-drawkit site*/
export async function getStaticProps() {
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
  const premiumHide = $(`.show-showcase`).html();
  const allShow = $(`.show-all`).html();
  const headContent = $(`head`).html();
  const footer = $(`.footer`).html();
  console.log("return");
  return {
    props: {
      headContent: headContent,
      globalStyles: globalStyles,
      supportScripts: supportScripts,
      navBar: navBar,
      hideLogin: hideLogin,
      LoggedinnavBar: LoggedinnavBar,
      footer: footer,
      HomeIllustration: homeIllustration,
      premiumHide: "premiumHide",
      allShow: allShow,
    },
  };
}
