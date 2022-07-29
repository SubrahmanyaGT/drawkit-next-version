import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { replace } from "../utils/replace-node";
import { log } from "logrocket";



export default function Signin(props) {
  let [auth, setAuth] = useState(supabase.auth.session());
  const parseOptions = {
    replace,
  };
  const router = useRouter();


  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-subscribe").get(0)) {
      if (auth != null) {
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
    if (!!$el.closest(".get-started").get(0)) {
      router.push("/");
    }
  }


  return (
    <>
      <Head>{parseHtml(props.headContent, parseOptions)}</Head>
      <div
        id="signin-div"
        onClick={wrapClickHandler}
      >
        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

Signin.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/choose-subscription").catch(
    (err) => {
      console.error(err);
    }
  );
  const html = res.data;
  const $ = cheerio.load(html);
  const bodyContent = $(`.main-wrapper`).html();
  const headContent = $(`head`).html();

  return {
    props: {
      bodyContent,
      headContent,
    },
  };
}
