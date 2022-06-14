import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import { supabase } from "../utils/supabaseClient";
import Script from "next/script";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import NavbarContent from "./navbar";

export default function Plans(props) {
  const router = useRouter();

  //................................................................................................................................//

  function isUrlInternal(link) {
    if (
      !link ||
      link.indexOf(`https:`) === 0 ||
      link.indexOf(`#`) === 0 ||
      link.indexOf(`http`) === 0 ||
      link.indexOf(`://`) === 0
    ) {
      return false;
    }
    return true;
  }

  // Replaces DOM nodes with React components
  function replace(node) {
    const attribs = node.attribs || {};
    if (attribs.hasOwnProperty("class")) {
      attribs["className"] = attribs["class"];
      delete attribs.class;
    }

    // Replace links with Next links

    if (node.name == `a`) {
      let { href, style, ...props } = attribs;
      if (!style && href) {
        if (
          href.includes("/illustration-types/") ||
          href.includes("/illustration-categories/") ||
          href.includes("/single-illustrations/")
        ) {
          console.log(href.slice(href.lastIndexOf("/"), href.length));
          // href = "/illustrations/unlock-colour";
          return (
            <Link
              href={
                "/illustrations" +
                href.slice(href.lastIndexOf("/"), href.length)
              }
            >
              <a {...props}>
                {!!node.children &&
                  !!node.children.length &&
                  domToReact(node.children, parseOptions)}
              </a>
            </Link>
          );
        }
        console.log(href);
        if (props.className) {
          if (props.className.includes("upgrade-plan-link")) {
            console.log(node.children[2].children[0].data);

            if (!supabase.auth.session()) {
              // not sigedin user
              return (
                <Link href="/plans">
                  <a {...props}>
                    <div className="upgrade-download">Upgrade Your Plan</div>
                    {!!node.children &&
                      !!node.children.length &&
                      domToReact([node.children[1]], parseOptions)}
                  </a>
                </Link>
              );
            } else if (node.children[2].children[0].data == "Premium") {
              return (
                <Link href="/plans">
                  <a {...props}>
                    <div className="upgrade-download">Upgrade Your Plan</div>
                    {!!node.children &&
                      !!node.children.length &&
                      domToReact([node.children[1]], parseOptions)}
                  </a>
                </Link>
              );
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
          <script
            {...attribs}
            dangerouslySetInnerHTML={{ __html: content }}
          ></script>
        );
      } else {
        <Script
          {...attribs}
          dangerouslySetInnerHTML={{ __html: content }}
          strategy="lazyOnload"
        ></Script>;
      }
    }
  }
  const parseOptions = { replace };

  //..................................................................................................................................//

  // useEffect(() => {

  // }, []);

  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#subscribe").get(0)) {
      //strip payment
      fetch("/api/strip")
        .then((response) => response.json())
        .then((data) => {
          router.push(data.session.url);
        });
      // console.log("subscribe");
    }
  }

  function runSwiper() {
    var mySwiper = new Swiper("#basic-swiper", {
      slidesPerView: 3,
      slidesPerGroup: 1,
      grabCursor: true,
      a11y: false,
      spaceBetween: 28,
      allowTouchMove: true,
      navigation: {
        nextEl: "#right-button",
        prevEl: "#left-button",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        480: {
          /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        767: {
          /* when window >= 767px - webflow tablet */ slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        992: {
          /* when window >= 988px - webflow desktop */ slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
      },
    });
  }

  return (
    <>
      <Head>
        {parseHtml(props.headContent, parseOptions)}
        {parseHtml(props.supportScripts, parseOptions)}
      
      </Head>
      <div onClick={wrapClickHandler}>
        <NavbarContent
          navbarContent={parseHtml(props.navbarContent, parseOptions)}
        />
        {parseHtml(props.headContent, parseOptions)}

        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      {parseHtml(props.footer, parseOptions)}

      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      <Script
          src="https://unpkg.com/swiper/swiper-bundle.min.js"
          onLoad={runSwiper}
        ></Script>

      {parseHtml(props.globalStyles, parseOptions)}
    </>
  );
}

export async function getServerSideProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/plans").catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const globalStyles = $(".global-styles").html();
  const bodyContent = $(`.main-wrapper`).html();
  const navbarContent = $(".navbar").html();
  const headContent = $(`head`).html();
  const supportScripts = Object.keys($(`script`))
    .map((key) => {
      if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    })
    .filter((src) => {
      if (src) return src;
    })
    .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
    .join("")
    .toString();
  const footer = $(`.footer-access`).html();

  return {
    props: {
      bodyContent: bodyContent,
      headContent: headContent,
      navbarContent: navbarContent,
      supportScripts: supportScripts,
      footer: footer,
      globalStyles: globalStyles,
    },
  };
}
