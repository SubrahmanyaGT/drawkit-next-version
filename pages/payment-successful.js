import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { replace } from "../utils/replace-node";

export default function paymentSuccessful(props) {
    const parseOptions = {
        replace,
      };
  return (
    <>
      {/* <Head>{parseHtml(props.headContent, parseOptions)}</Head> */}
      <div>{parseHtml(props.bodyContent, parseOptions)}</div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
};

export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios(
    "https://drawkit-v2.webflow.io/payment-successful"
  ).catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  const bodyContent = $(`.main-wrapper`).html();
  const headContent = $(`head`).html();

  return {
    props: {
      bodyContent,
      headContent,
    },
  };
}
