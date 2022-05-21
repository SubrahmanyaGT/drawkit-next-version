// import { parseHTML } from "cheerio/lib/static";
// import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
// import parseHtml, { domToReact } from 'html-react-parser'

// import { parse } from 'node-html-parser';

// export default function Home(props) {
//   console.log(parseHtml(props.response));
//   return <div>{(props.response)}</div>;
// }

// export async function getStaticProps() {
//   const axios = require("axios");
//   const cheerio = require('cheerio');

//   let response = await axios("https://drawkit-v2.webflow.io/");
//   console.log(response.data);

//   // Parse HTML with Cheerio
//   const cherioDoc = cheerio.load(response.data);

//   // Convert back to HTML strings
//   const bodyContent = cherioDoc(`body`).html();
//   const headContent = cherioDoc(`head`).html();
//   return {
//     props: { response: bodyContent }, // will be passed to the page component as props
//   };
// }

import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";

export default function Home(props) {
  return (
    <>
    <Head>
      {parseHtml(props.headContent)}

    </Head>
      {parseHtml(props.bodyContent)}
      {
        // parseHtml(props.navDrop)
      }
    </>
  );
}

export async function getStaticProps(ctx) {
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;


  let res = await axios("https://drawkit-v2.webflow.io/").catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);
  console.log(html);

  $('.navlink').addClass('title').html()
  const bodyContent = $(`body`).html();
  const navDrop=$('.nav-dropdown-wrapper').html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
      navDrop,
    },
    revalidate: 3,
  };
}
