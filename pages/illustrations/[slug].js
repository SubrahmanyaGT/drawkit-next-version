import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import Script from "next/script";
import { supabase } from "../../utils/supabaseClient";
import { replace } from "../../utils/replace-node";
import JSZip  from "jszip";
import FileSaver from 'file-saver';
import NavbarContent from "../navbar";
/**................................................................ */
// function isUrlInternal(link) {
//   if (
//     !link ||
//     link.indexOf(`https:`) === 0 ||
//     link.indexOf(`#`) === 0 ||
//     link.indexOf(`http`) === 0 ||
//     link.indexOf(`://`) === 0
//   ) {
//     return false;
//   }
//   return true;
// }
// function replace(node) {
//   const attribs = node.attribs || {};
//   if (attribs.hasOwnProperty("class")) {
//     attribs["className"] = attribs["class"];
//   }
//   if (node.name === `a`) {
//     const { href, style, ...props } = attribs;
//     if (!style && href) {
//       return (
//         <Link href={href}>
//           <a {...props} data={"converted"}>
//             {!!node.children &&
//               !!node.children.length &&
//               domToReact(node.children, parseOptions)}
//           </a>
//         </Link>
//       );
//     }
//     if (href) {
//     }
//   }
//   if (node.name === `script`) {
//     let content = get(node, `children.0.data`, ``);
//     if (content && content.trim().indexOf(`WebFont.load(`) === 0) {
//       content = `setTimeout(function(){${content}}, 1)`;
//       return (
//         <script
//           {...attribs}
//           dangerouslySetInnerHTML={{ __html: content }}
//         ></script>
//       );
//     }
//   }
//   const { href, style, ...props } = attribs;
// }
/**................................................................ */

export default function Illustration(props) {
  const parseOptions = { replace };

  const [file, setFile] = useState([]);
  const downloadSupabase = async (folderName) => {
    const { data, error } = await supabase.storage
      .from("illustration-downloadable")
      .list(folderName);
    setFile(data);

    for (let i = 0; i < file.length; i++) {
      console.log(file[i]);
      const { data, error } = await supabase.storage
        .from("public/illustration-downloadable")
        .download(`illustrationid2/${file[i].name}`);

      console.log(data);

      const zip = new JSZip();
      zip.file(`${file[i].name}`, data);
      zip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, `illustrationid2.zip`);
      });
    }
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
      let folderName = $("#sb-download").children().get(2).innerText;
      if (await downloadSupabase(folderName)) {
        // router.push("/")
      }
    }
  }

  return (
    <>
      <Head>{parseHtml(props.headContent, parseOptions)}</Head>
      <div onClick={wrapClickHandler}>
        <span style={{ fontSize: "10px", position: "fixed" }}>
          Illustrations/[slug]
        </span>
        <NavbarContent navbarContent=
      {parseHtml(props.navBar, parseOptions)}
       />

        {parseHtml(props.bodyContent, parseOptions)}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
        {parseHtml(props.supportScripts, parseOptions)}
        {parseHtml(props.footer, parseOptions)}
        {parseHtml(props.globalStyles, parseOptions)}
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
    const navBar = $(`.nav-access`).html();
    const bodyContent = $(`.main-wrapper`).html();
    //   const navDrop=$('.nav-dropdown-wrapper').html();
    const headContent = $(`head`).html();
    const footer = $(`.footer-access`).html();
    const globalStyles = $(".global-styles").html();

    const supportScripts = Object.keys($(`script`))
      .map((key) => {
        if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
      })
      .filter((src) => {
        if (src) return src;
      })
      .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
      .join("");

    return {
      props: {
        bodyContent: bodyContent,
        headContent: headContent,
        navBar: navBar,
        supportScripts: supportScripts,
        footer: footer,
        globalStyles: globalStyles,
      },
      // revalidate: 3,
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
