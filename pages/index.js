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
// import WebflowScript from "./webflow"
import("./webflow");
import MainWrapper from "./mainwrapper";

export default function Home(props) {
  // console.log((props.bodyScript));
  return (
    <>
      {/* <Head>{parseHtml(props.headContent)}</Head> */}
      {/* {parseHtml(props.bodyContent)}
      <MainWrapper mainWrap={props.mainWrap} />
  {parseHtml(props.footer)}*/}
      {parseHtml(props.bodyScript)}
      {/* {parseHtml(props.bodyScript)} */}
      {/* <WebflowScript/> */}
      {/* <script type="text/javascript" src="https://rawgit.com/Drawkit-v1/drawkit-git/main/js/webflow.e14eb8a4c.js">  </script> */}
      {/* <script type="text/javascript" src="https://cdn.rawgit.com/Drawkit-v1/drawkit-git@main/js/webflow.e14eb8a4c.js">  </script> */}
      <script
        src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/js/webflow.03263472c.js"
        type="text/javascript"
      ></script>
    </>
  );
}

// export async function getStaticProps({ req, res }) {
//   // res.setHeader(
//   //   "Cache-Control",
//   //   "public, s-maxage=10, stale-while-revalidate=59"
//   // );
//   // const puppeteer = require("puppeteer");

//   // const scripts = async () => {
//   //   const browser = await puppeteer.launch();
//   //   const page = await browser.newPage();
//   //   await page.goto("https://drawkit-v2.webflow.io/");
//   //   await page.setRequestInterception(true);
//   //   page.on("request", (request) => {
//   //     if (request.resourceType() === "js") {
//   //       request.continue();
//   //     } else {
//   //       request.abort()
//   //     }
//   //   });

//   //   let dimensions = await page.evaluate(() => {
//   //     return {
//   //       el: JSON.stringify(
//   //         performance.getEntriesByType("resource").filter((v) => {
//   //           if (v.initiatorType === "script") {
//   //             return v.name;
//   //           }
//   //         })
//   //       ),
//   //       entries: JSON.stringify(
//   //         performance.getEntriesByType("resource").filter((entry) => {
//   //           if (entry.initiatorType === "script") {
//   //             return entry.name;
//   //           }
//   //         })
//   //       ),
//   //     };
//   //   });
//   //   dimensions = JSON.parse(dimensions.el);
//   //   await browser.close();
//   //   return dimensions.map((dim) => {
//   //     return `<script  type="text/javascript" src="${dim.name}" ></script>`;
//   //   });
//   // };

//   // let headScript = await scripts();
//   // let bodyScript = headScript.join("");

//   const cheerio = await import(`cheerio`);
//   const axios = (await import(`axios`)).default;

//   // const night = await nightmare
//   //   .goto("https://drawkit-v2.webflow.io/")
//   //   .evaluate(() => {
//   //     return {
//   //       el: JSON.stringify(
//   //         performance.getEntriesByType("resource").filter((v) => {
//   //           if (v.initiatorType === "script") {
//   //             return v.name;
//   //           }
//   //         })
//   //       )
//   //     };
//   //   })
//   //   .end();

//   let resl = await axios("https://drawkit-v2.webflow.io/").catch((err) => {
//     console.error(err);
//   });
//   const html = resl.data;

//   const $ = cheerio.load(html);
//   // console.log(html);

//   console.log($("<script>"));
//   // $(".navlink").addClass("title").html();
//   // const bodyContent = $(`.navbar`).html();
//   // const mainWrap = $(`.main-wrapper`).html();
//   // const footer = $("footer").html();
//   const cherioScript = $('*').html();

//   const navDrop = $(".nav-dropdown-wrapper").html();
//   const headContent = $(`head`).html();

//   return {
//     props: {
//       // bodyContent: bodyContent,
//       // headContent: headContent,
//       // navDrop: navDrop,
//       // mainWrap: mainWrap,
//       bodyScript: cherioScript,
//       // footer: footer,
//     },
//   };
// }

export async function getStaticProps() {
  // const cheerio = require("cheerio");
  // const request = require("request");

  // request(
  //   {
  //     method: "GET",
  //     url: "https://drawkit-v2.webflow.io/",
  //   },
  //   (err, res, body) => {
  //     if (err) return console.error(err);

  //     let $ = cheerio.load(body);

  //     $("main").after("<footer>This is a footer</footer>");

  //     console.log($.html());
  //   }
  // );

  var request = require("request");
  var cheerio = require("cheerio");

  var formUrl = "https://drawkit-v2.webflow.io/";
  var request = request.defaults();

  let supportScripts;
   request(formUrl, (error, response, html) => {
    // console.log(html);
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      
      let scripts =Object.keys($(`script`))
        .map((key) => {
          if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
        })
        .filter((src) => {
          if (src) return src;
        });
        let body=$(`body`).html();
        supportScripts= {scripts, body};
    } else {
      console.log(" console.log();");
    }
  });
(()=>{setTimeout( () => {
  console.log(supportScripts.scripts);
  } ,3000)})()
  return {
    props: {
      bodyScript: "cherioScript",
    },
  };
}
