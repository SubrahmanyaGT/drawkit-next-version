
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";
// import('./webflow')

export default function MainWrapper(props) {
  return (
    <>
    
      {parseHtml(props.mainWrap)}
      
    </>
  );
}

// export async function getStaticProps(ctx) {
//   const cheerio = await import(`cheerio`);
//   const axios = (await import(`axios`)).default;


//   let res = await axios("https://drawkit-v2.webflow.io/").catch((err) => {
//     console.error(err);
//   });
//   const html = res.data;

//   const $ = cheerio.load(html);
//   console.log(html);

//   $('.navlink').addClass('title').html()
//   const navDrop=$('.nav-dropdown-wrapper').html();
//   const headContent = $(`head`).html();
//   return {
//     props: {
//       bodyContent,
//       headContent,
//       navDrop,
//     },
//     revalidate: 3,
//   };
// } 
