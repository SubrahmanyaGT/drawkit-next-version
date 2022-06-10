import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import { supabase } from "../utils/supabaseClient";
import Script from "next/script";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/router'
import NavbarContent from "./navbar";

export default function Plans(props) {
const router = useRouter()

  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#subscribe").get(0)) {
        fetch('/api/strip').then((response) => response.json()).then((data) => {router.push(data.session.url)})
      // console.log("subscribe");

    }
  }

  return (
    <>
      <div onClick={wrapClickHandler}>
        <NavbarContent navbarContent={parseHtml(props.navbarContent)}/>
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
    const navbarContent=$('.navbar').html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
      navbarContent
    },
    revalidate: 3,
  };
}
