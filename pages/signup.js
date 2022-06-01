import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from 'next/script'

const supabaseSignUp = async (email, password) => {
  const { user, session, error } = await supabase.auth.signUp({
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
  if (!error) {
    alert("google");
  }
}
export default function Home(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  /**Functions */
  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#signup").get(0)) {
      console.log(email, password);
      await supabaseSignUp(email, password).then((data) => {
        if(!data.error){
          router.push('/')
      }
      })
      
    }
    if (!!$el.closest("#d-signup-google").get(0)) {
      signInWithGoogle();
    }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-signup-email").get(0)) {
      setEmail($el.closest("#d-signup-email").val());
      console.log('email',email);
    }
    if (!!$el.closest("#d-signup-pass").get(0)) {
      setPassword($el.closest("#d-signup-pass").val());
      console.log("password changed", password);
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

  let res = await axios("https://drawkit-v2.webflow.io/signup").catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);
  $("").replaceWith("<div onClick={myFunction}> connect</div>");

  console.log($("#d-signup-button")[0]);
  const bodyContent = $(`.page-wrapper`).html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
    },
    revalidate: 3,
  };
}
