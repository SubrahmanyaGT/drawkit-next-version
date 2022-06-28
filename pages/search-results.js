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
import { replace } from "../utils/replace-node";

export default function Plans(props) {
  const router = useRouter();
  const [premiumUser, setPremiumUser] = useState("inactive");
  let [auth, setAuth] = useState(supabase.auth.session());
console.log(router);
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

  
  const parseOptions = { replace };

  //..................................................................................................................................//

  useEffect(() => {
    if (supabase.auth.session()) {
      fetch("/api/check-active-status", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({ user_id: auth.user.id }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          setPremiumUser(data.status);
        });

      // let uid = supabase.auth.session().user.id;
      // supabase
      //   .from("stripe_users")
      //   .select("stripe_user_id")
      //   .eq("user_id", uid)
      //   .then(({ data, error }) => {
      //     fetch("api/c")
      //       .then(function (response) {
      //         return response.json();
      //       })
      //       .then(function (data) {
      //         console.log(data);
      //         setPremiumUser(data.status);
      //       });
      //   });
    }
  }, []);


  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#subscribe").get(0)) {
      if (auth != null) {
        //strip payment
        fetch("/api/strip", {
          method: "POST",
          headers: {
            contentType: "application/json",
          },
          body: JSON.stringify({ user_id: auth.user.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.session.url) router.push(data.session.url);
            else alert(data.session.message);
          });
      } else {
        router.push("/signup");
      }
    }
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
        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      {parseHtml(props.footer, parseOptions)}

      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      

      {parseHtml(props.globalStyles, parseOptions)}
    </>
  );
}

export async function getServerSideProps(search) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;
  console.log("https://drawkit-v2.webflow.io"+search.resolvedUrl);

  let res = await axios("https://drawkit-v2.webflow.io"+search.resolvedUrl).catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const globalStyles = $(".global-styles").html();
  const bodyContent = $(`.main-wrapper`).html();
  const navbarContent = $(".nav-access").html();
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
