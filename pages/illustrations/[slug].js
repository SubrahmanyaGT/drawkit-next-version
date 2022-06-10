import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React from "react";
import Script from "next/script";
import { supabase } from "../../utils/supabaseClient";

const downloadSupabase = async () => {
  const { data, error } = await supabase.storage
    .from("illustrations-small-png")
    .download("test.jpeg");
};

const Illustrations = (props) => {
  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest(".upgrade-plan").get(0)) {
      event.preventDefault();
      if (await downloadSupabase()) {
        // router.push("/");
      }
    }
  }

  return (
    <div onClick={wrapClickHandler}>
      <span style={{ fontSize: "10px", position: "fixed" }}>
        Illustrations/[slug]
      </span>
      {parseHtml(props.navBar)}
      {parseHtml(props.headContent)}
      {parseHtml(props.bodyContent)}
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </div>
  );
};
// export async function getStaticPaths() {
//   // let it=await items.items;
//   //  let A= await items.items.map(item =>({ params: { slug: item.slug } }))
//   return {
//     paths: [{ params: { slug: "food-delivery-illustrations-animations" } }],
//     fallback: true, // false or 'blocking'
//   };
// }

export const getServerSideProps = async (paths) => {
  console.log(paths.params.slug);

  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;
  let illTypes = ["2d", "3d", "animations", "icons", "all", "mockups"];
  let illCatg = [
    "work",
    "covid-19",
    "e-commerce",
    "media",
    "connecting",
    "video",
  ];
  let res;
  if (illTypes.includes(paths.params.slug)) {
    res = await axios(
      `https://drawkit-v2.webflow.io/illustration-types/${paths.params.slug}`
    ).catch((err) => {
      console.error(err);
    });
  } else if (illCatg.includes(paths.params.slug)) {
    res = await axios(
      `https://drawkit-v2.webflow.io/illustration-categories/${paths.params.slug}`
    ).catch((err) => {
      console.error(err);
    });
  }
  else {
    
      res = await axios(
        `https://drawkit-v2.webflow.io/illustrations/${paths.params.slug}`
      ).catch((err) => {
        console.error(err);
      });
    
      if(!res){res = await axios(
        `https://drawkit-v2.webflow.io/single-illustrations/${paths.params.slug}`
      ).catch((err) => {
        console.error(err);
      });}
    
   
  }
  if (res) {
    const html = res.data;

    const $ = cheerio.load(html);

    //   $('.navlink').addClass('title').html()
    const navBar = $(`.navbar`).html();
    const bodyContent = $(`.main-wrapper`).html();
    //   const navDrop=$('.nav-dropdown-wrapper').html();
    const headContent = $(`head`).html();
    return {
      props: {
        bodyContent:bodyContent,
        headContent:headContent,
        navBar:navBar,
      },
      // revalidate: 3,
    };
  }
  else{
    return {
      redirect: {
        destination: '/400',
        permanent: false,
      },
    }
}
};

export default Illustrations;
