import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";
import Script from "next/script";
import { supabase } from "../utils/supabaseClient";
import { replace } from "../utils/replace-node";
import NavbarContent from "./navbar";
import { useEffect } from "react";

export default function Slug(props) {
  const parseOptions = { replace };
  const loadActive=() => {
    if (typeof window !== "undefined") {
      $(".filter-all-button").addClass("active-all");
    }
  };
  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest(".view-all-add-button").get(0)) {
      $(".button-filter-item").show();
      $(".view-all-add-button").hide();
    }
    if (!!$el.closest(".blog-filter-button").get(0)) {
      $(".filter-all-button").removeClass("active-all");
    }
  }

  return (
    <>
      <Script
        defer
        src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-selectcustom@1/selectcustom.js"
      ></Script>
      <div onClick={wrapClickHandler}>
      <Script strategy="afterInteractive" src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js" onLoad={loadActive}></Script>
        <div>
          {parseHtml(props.bodyContent, parseOptions)}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(props) {
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res;
  res = await axios(
    `https://drawkit-v2.webflow.io/${props.query.slug.join("/")}`
  ).catch((err) => {
    console.error(err);
  });

  if (res) {
    const html = res.data;

    const $ = cheerio.load(html);

    //   $('.navlink').addClass('title').html()
    const navBar = $(`.nav-access`).html();
    const bodyContent = $(`.main-wrapper`).html();
    //   const navDrop=$('.nav-dropdown-wrapper').html();
    const headContent = $(`head`).html();
    const footer = $(`.footer-access`).html();
    const globalStyles = $(".global-styles").html();

    const supportScripts = Object.keys($(`script`))
      .map((key) => {
        if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
      })
      .filter((src) => {
        if (src) return src;
      })
      .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
      .join("");

    return {
      props: {
        bodyContent: bodyContent,
        headContent: headContent,
        navBar: navBar,
        supportScripts: supportScripts,
        footer: footer,
        globalStyles: globalStyles,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/400",
        permanent: false,
      },
    };
  }
}
