import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from 'next/script'



const supabaseSignIn = async (email, password) => {
  console.log(email, password);
  const { user, session, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });
  if (!error) {
    return true;
  }
  else {
    return false;
  }
};

async function signInWithGoogle() {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "google",
  });
}

export default  function Home(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-signin-google").get(0)) {
      signInWithGoogle();
    }
    if (!!$el.closest("#signin").get(0)) {
      event.preventDefault();
      if (await supabaseSignIn(email, password)) {
        console.log( await supabaseSignIn(email, password));
        router.push("/");
      }
    }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-signin-email").get(0)) {
      setEmail($el.closest("#d-signin-email").val());
    }
    if (!!$el.closest("#d-signin-pass").get(0)) {
      setPassword($el.closest("#d-signin-pass").val());
    }
  }
  return (
    <>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {parseHtml(props.headContent)}

        {parseHtml(props.bodyContent)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/signin").catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);

  //   $('.navlink').addClass('title').html()
  const bodyContent = $(`.main-wrapper`).html();
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
}
