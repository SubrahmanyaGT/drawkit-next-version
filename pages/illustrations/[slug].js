import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";

const Webflow = require('webflow-api')
const webflow = new Webflow({ token: '900efc1ba158f8be74765be50e9e36de1cc980e13a5ce118a317ee80667f9d0c'})
const items = webflow.items({ collectionId: '628c91a615d540211b2031aa' });


const Illustrations = (props) => {
  // const router = useRouter()
  // const { slug } = router.query
  return (
    <div>
      {parseHtml(props.navBar)}
      {parseHtml(props.headContent)}
      {parseHtml(props.bodyContent)}
    </div>
  );
};
export async function getStaticPaths() {
  let it=await items.items;
//  let A= await items.items.map(item =>({ params: { slug: item.slug } }))
  return {
    paths: [
      { params: { slug: "love-family-illustrations" } },
      { params: { slug: "food-delivery-illustrations-animations" } },
      { params: { slug: "product-project-managers-illustrations" } },
      { params: { slug: "fathers-family-illustrations" } },
    ],
    fallback: true, // false or 'blocking'
  };
}

export const getStaticProps = async (paths) => {
  console.log(paths.params.slug);

  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios(
    `https://drawkit-v2.webflow.io/illustrations/${paths.params.slug}`
  ).catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const navBar = $(`.navbar`).html();
  const bodyContent = $(`.main-wrapper`).html();
  //   const navDrop=$('.nav-dropdown-wrapper').html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
      navBar,
    },
    revalidate: 3,
  };
};

export default Illustrations;
