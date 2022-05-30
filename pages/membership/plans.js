import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import Script from "next/script";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";


export default function Plans(props) {

  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#subscribe").get(0)) {
     
    }
    
  }

  return (
    <>
      <div onClick={wrapClickHandler}>
        {parseHtml(props.headContent)}

        {parseHtml(props.bodyContent)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/plans").catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const bodyContent = $(`.main-wrapper`).html();
  //   const navDrop=$('.nav-dropdown-wrapper').html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
      //   navDrop,
    },
    revalidate: 3,
  };
}
