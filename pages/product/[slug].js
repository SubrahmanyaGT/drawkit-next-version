import { useRouter } from "next/router";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { supabase } from "../../utils/supabaseClient";
import { replace } from "../../utils/replace-node";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Illustration(props) {
  const parseOptions = { replace };

  const router = useRouter();

  const [file, setFile] = useState([]);
  const downloadSupabase = async (item_id) => {
    const path = await supabase
      .from("illustrations_pack")
      .select("downloadable_illustration,pricing_type")
      .eq("wf_item_id", item_id);
      console.log('path',path.data[0].pricing_type);
    const file = path.data[0].downloadable_illustration;
    const fileName = file.substring(file.lastIndexOf("/") + 1, file.length);
    console.log(fileName);

    const { data, error } = await supabase.storage
      .from("illustration-downloadable")
      .download(fileName);

    // const { signedURL, error } = await supabase.storage
    //   .from("illustration-downloadable")
    //   .createSignedUrl(
    //     fileName,
    //     60
    //   );
    //   console.log(signedURL);

    // saveAs(data,fileName);
    const strip = await supabase.from("stripe_users").select("*");
    console.log(strip);
    saveAs(data, fileName);
  };

  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest(".upgrade-plan").get(0)) {
      event.preventDefault();
      if (await downloadSupabase()) {
        // router.push("/");
      }
    }
    if (!!$el.closest("#sb-download").get(0)) {
      if (supabase.auth.session() != null) {
        let item = $("#sb-download").children().get(2).innerText;
        await downloadSupabase(item);
      } else {
        router.push("/signup");
      }
    }
  }

  return (
    <>
      <div onClick={wrapClickHandler}>
        {parseHtml(props.bodyContent, parseOptions)}

        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      </div>
    </>
  );
}

export const getServerSideProps = async (paths) => {
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
  } else {
    res = await axios(
      `https://drawkit-v2.webflow.io/illustrations/${paths.params.slug}`
    ).catch((err) => {
      console.error(err);
    });

    if (!res) {
      res = await axios(
        `https://drawkit-v2.webflow.io/single-illustrations/${paths.params.slug}`
      ).catch((err) => {
        console.error(err);
      });
    }
  }
  if (res) {
    const html = res.data;

    const $ = cheerio.load(html);

    //   $('.navlink').addClass('title').html()
    // const navBar = $(`.nav-access`).html();
    const bodyContent = $(`.main-wrapper`).html();
    //   const navDrop=$('.nav-dropdown-wrapper').html();
    // const headContent = $(`head`).html();
    // const footer = $(`.footer-access`).html();
    // const globalStyles = $(".global-styles").html();

    // const supportScripts = Object.keys($(`script`))
    //   .map((key) => {
    //     if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    //   })
    //   .filter((src) => {
    //     if (src) return src;
    //   })
    //   .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
    //   .join("");

    return {
      props: {
        bodyContent: bodyContent,
        headContent: "headContent",
        navBar: "navBar",
        supportScripts: "supportScripts",
        footer: "footer",
        globalStyles: "globalStyles",
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
};
