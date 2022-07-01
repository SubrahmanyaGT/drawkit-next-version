import { useRouter } from "next/router";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { supabase } from "../../utils/supabaseClient";
import { replace } from "../../utils/replace-node";
import JSZip from "jszip";
import FileSaver from "file-saver";

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

  // function jetboost() {
  //   window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";
  //   (function (d) {
  //     var s = d.createElement("script");
  //     s.src = "https://cdn.jetboost.io/jetboost.js";
  //     s.async = 1;
  //     d.getElementsByTagName("head")[0].appendChild(s);
  //   })(document);

  //   $(".filter-all").addClass("active-all");

  //   $(".filter-button").click(function () {
  //     $(".filter-all").removeClass("active-all");
  //   });
  //   console.log('jetbost');
  // }
  

  return (
    <>
      <div onClick={wrapClickHandler} >
        {parseHtml(props.bodyContent, parseOptions)}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      </div>
      {/* <Script id="jetboost-script" type="text/javascript" dangerouslySetInnerHTML={{__html: `window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8" (function(d) { var s = d.createElement("script"); s.src = "https://cdn.jetboost.io/jetboost.js"; s.async = 1; d.getElementsByTagName("head")[0].appendChild(s); })(document) }`}}/> */}
    
      <script
      id="key"
            dangerouslySetInnerHTML={{
              __html: `
              console.log('Freedom!!!!!!!!!!!!!!!');
                  `,
            }}
          ></script>

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
