import { useRouter } from "next/router";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { supabase } from "../../utils/supabaseClient";
// import { replace } from "../../utils/replace-node";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useUser } from "../../lib/authInfo";
import Link from "next/link";

export default function Illustration(props) {
  const { user, setUser } = useUser();
  let [auth, setAuth] = useState(supabase.auth.session());

  function replace(node) {
    const attribs = node.attribs || {};
    if (attribs.hasOwnProperty("class")) {
      attribs["className"] = attribs["class"];
      delete attribs.class;
    }

    // Replace links with Next links
    if (node.name == "div") {
      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("sb-function")) {
          console.log(node.children[3].children[0].data);
          let pricing_type = node.children[3].children[0].data;
          if (
            ( pricing_type == "Premium" &&
              user.subscription_details.status == "active") ||
            (pricing_type == "Free" && auth!= null)
          ) {
            return (
              //download
              <div {...props}>
                Download Now
                {!!node.children &&
                  !!node.children.length &&
                  domToReact(
                    [node.children[1], node.children[2]],
                    parseOptions
                  )}
              </div>
            );
          } else {
            return (
              //download
              <div {...props}>
                Upgrade Your Plan
                {!!node.children &&
                  !!node.children.length &&
                  domToReact(
                    [node.children[1], node.children[2]],
                    parseOptions
                  )}
              </div>
            );
          }
        }
      }
    }

    if (node.name == "section") {
      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("section-home_hero")) {
          if (supabase.auth.session()) {
            return <div></div>;
          }
        }
        if (props.className.match(/^section-brands$/)) {
          if (supabase.auth.session()) {
            return <div></div>;
          }
        }
      }
    }

    if (node.name == `a`) {
      let { href, style, ...props } = attribs;
      if (href) {
        if (
          href.includes("/illustration-types/") ||
          href.includes("/illustration-categories/") ||
          href.includes("/single-illustrations/") ||
          (href.includes("/illustrations") &&
            !props.className.includes("upgrade-plan-link "))
        ) {
          // console.log(href.slice(href.lastIndexOf("/"), href.length));
          return (
            <Link
              href={"/product" + href.slice(href.lastIndexOf("/"), href.length)}
            >
              <a {...props}>
                {!!node.children &&
                  !!node.children.length &&
                  domToReact(node.children, parseOptions)}
              </a>
            </Link>
          );
        }
        if (attribs.className) {
          if (props.className.includes("upgrade-plan-link ")) {
            // console.log(node.children[2].children[0].data);

            if (!supabase.auth.session()) {
              // not sigedin user
              return (
                <Link href="/plans">
                  <a {...props}>
                    <div className="upgradedownload">Upgrade Your Plan</div>
                    {!!node.children &&
                      !!node.children.length &&
                      domToReact([node.children[1]], parseOptions)}
                  </a>
                </Link>
              );
            } else {
              if (
                node.children[2].children[0].data == "Premium" &&
                user.subscription_details.status != "active"
              ) {
                return (
                  <Link href="/plans">
                    <a {...props}>
                      <div className="upgradedownload">Upgrade Your Plan</div>
                      {!!node.children &&
                        !!node.children.length &&
                        domToReact([node.children[1]], parseOptions)}
                    </a>
                  </Link>
                );
              } else {
                return (
                  //download
                  <Link href={href}>
                    <a {...props}>
                      <div className="upgradedownload">Download Now</div>
                      {!!node.children &&
                        !!node.children.length &&
                        domToReact([node.children[1]], parseOptions)}
                    </a>
                  </Link>
                );
              }
            }
          } else {
            return (
              <Link href={href}>
                <a {...props}>
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(node.children, parseOptions)}
                </a>
              </Link>
            );
          }
        }

        return (
          <Link href={href}>
            <a {...props}>
              {!!node.children &&
                !!node.children.length &&
                domToReact(node.children, parseOptions)}
            </a>
          </Link>
        );
      }
    }
    // Make Google Fonts scripts work
    if (node.name === `script`) {
      let content = get(node, `children.0.data`, ``);

      if (content && content.trim().indexOf(`WebFont.load(`) === 0) {
        content = `setTimeout(function(){${content}}, 1)`;
        return (
          <Script
            {...attribs}
            dangerouslySetInnerHTML={{ __html: content }}
          ></Script>
        );
      } else {
        <Script
          {...attribs}
          dangerouslySetInnerHTML={{ __html: content }}
          strategy="lazyOnload"
        ></Script>;
      }
    }
    const { href, style, ...props } = attribs;
  }

  const parseOptions = { replace };

  const router = useRouter();

  const [file, setFile] = useState([]);
  const downloadSupabase = async (item_id) => {
    const path = await supabase
      .from("illustrations_pack")
      .select("downloadable_illustration,pricing_type")
      .eq("wf_item_id", item_id);
    const pricing_type = path.data[0].pricing_type;
    if (
      (pricing_type == "Premium" &&
        user.subscription_details.status == "active") ||
      pricing_type == "Free"
    ) {
      const file = path.data[0].downloadable_illustration;
      const fileName = file.substring(file.lastIndexOf("/") + 1, file.length);
      console.log(fileName);

      const { data, error } = await supabase.storage
        .from("illustration-downloadable")
        .download(fileName);
      const strip = await supabase.from("stripe_users").select("*");
      console.log(strip);
      saveAs(data, fileName);
    } else {
      router.push("/plans");
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
      if (supabase.auth.session() != null) {
        let item = $("#sb-download").children().get(1).innerText;

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
