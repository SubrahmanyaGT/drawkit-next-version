import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";

const Illustrations = (props) => {
  // const router = useRouter()
  // const { slug } = router.query
  return (
    <div>
      {parseHtml(props.headContent)}

      {parseHtml(props.bodyContent)}
      {
        // parseHtml(props.navDrop)
      }
    </div>
  );
};
export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: "love-family-illustrations" } },
      { params: { slug: "food-delivery-illustrations-animations" } },
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
  const bodyContent = $(`body`).html();
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
};

export default Illustrations;
