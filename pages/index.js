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
import Image from "next/image";

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};
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
    } else {
      <Script
        {...attribs}
        dangerouslySetInnerHTML={{ __html: content }}
        strategy="lazyOnload"
      ></Script>;
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

  // if (node.name == "img") {
  //   const { href, style, ...props } = attribs;
  //   console.log(node);
  //   return (
  //     <div style={{position:"relative"}}  {...props}>
  //       <Image
  //         {...props}
  //         loader={myLoader}
  //         src={props.src}
  //         alt={props.alt}
  //         layout="fill"
  //         objectFit="cover"
  //       />
  //     </div>
  //   );
  // }
}
const parseOptions = { replace };

export default function Home(props) {
  let [headContent, setheadContent] = useState(props.headContent);
  let [navBar, setnavbar] = useState(props.navBar);
  let [auth, setAuth] = useState(supabase.auth.user());
  let[blog,setBlog]=useState(props.showBlog)
  let [hideLogin, setHideLogin] = useState(props.hideLogin);
  let [supportScripts, setsupportScripts] = useState(props.supportScripts);
  //  console.log(props.supportScripts);

  useEffect(() => {
    window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";
    (function (d) {
      var s = d.createElement("script");
      s.src = "https://cdn.jetboost.io/jetboost.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })(document);
    console.log("in index");
    if (!supabase.auth.session()) {
      console.log(supabase.auth.session());
      setHideLogin(props.hideLogin);
      setBlog("")
    } else {
      setHideLogin("");
      setBlog(props.showBlog);
      
    }
  }, []);
  return (
    <>
      <Head>
        {parseHtml(headContent, parseOptions)}
        {parseHtml(props.globalStyles, parseOptions)}
        {parseHtml(supportScripts, parseOptions)}
      </Head>
      <NavbarContent
        navbarContent={parseHtml(navBar, parseOptions)}
        scripts={parseHtml(supportScripts, parseOptions)}
      />
      {<MainWrapper mainWrap={parseHtml(hideLogin, parseOptions)} />}
      <MainWrapper mainWrap={parseHtml(props.HomeIllustration, parseOptions)} />
      {/* <MainWrapper mainWrap={parseHtml(props.showFree, parseOptions)} /> */}
      <MainWrapper mainWrap={parseHtml(props.showcase, parseOptions)} />
     <MainWrapper mainWrap={parseHtml(blog, parseOptions)} /> 
      <MainWrapper mainWrap={parseHtml(props.allShow, parseOptions)} />
     
      {parseHtml(props.footer, parseOptions)}
      {/* <div dangerouslySetInnerHTML={{__html:`<script id="jetboost-script" type="text/javascript"> window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8"; (function(d) { var s = d.createElement("script"); s.src = "https://cdn.jetboost.io/jetboost.js"; s.async = 1; d.getElementsByTagName("head")[0].appendChild(s); })(document); </script>`}}>

      </div> */}
      {/* {parseHtml(supportScripts, parseOptions)} */}
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
  const showBlog=$(`.show-blogs-login`).html()
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
      showFree:showFree,
      showcase:showcase,
      showBlog:showBlog,
      HomeIllustration: homeIllustration,
      showFree: showFree,
      allShow: allShow,
     
    },
  };
}
