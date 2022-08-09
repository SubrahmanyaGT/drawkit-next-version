import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { replace } from "../utils/replace-node";

const supabaseSignIn = async (email, password) => {
  // console.log(email, password);
  const { user, session, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });
  // console.log(user, session, error);
  if (!error) {
    await supabase
      .from('user_profile')
      .insert([
        { first_name: email, last_name: email, user_id: 123 }
      ])


    return true;
  } else {
    return false;
  }
};

async function signInWithGoogle() {

  const { user, session, error } = await supabase.auth.signIn({
    provider: "google",

  });
}

export default function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valEmail, setValEmail] = useState(false);
  const [valPassword, setValPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const parseOptions = {
    replace,
  };
  const router = useRouter();
  useEffect(() => {
    if (loader)
      document.getElementById('signinloaderWrapper').innerHTML = `<div class="button-wrap signin">
      <div class="btn-primary align-bottom"><div>Loading... <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div></div>
      <div class="btn-overlay"></div>
    </div>`
    else
      document.getElementById('signinloaderWrapper').innerHTML = `<div id="signin" class="button-wrap signin">
    <div class="btn-primary"><div>Sign in</div></div>
    <div class="btn-overlay"></div>
  </div>`
  }, [loader])

  useEffect(() => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setValEmail(true);
    } else {
      setValEmail(false);
    }
    if (password.length >= 8) {
      setValPassword(true);
    } else {
      setValPassword(false);
    }
  }, [email, password]);

  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-signin-google").get(0)) {
      signInWithGoogle();
    }
    if (!!$el.closest("#signin").get(0)) {
      event.preventDefault();
      // validateEmailPassword();
      //true
      setLoader(true);
      if ((await supabaseSignIn(email, password)) && valEmail && valPassword) {
        router.push("/");
      } else {
        $(".validator-message").text("Invalid Signin Attempt");
        //false
        setLoader(false)
      }
    }

    if (!!$el.closest(".reveal-pw").get(0)) {
      let signin_input = $("#d-signin-pass");
      signin_input.attr("type", "text");
      $(".reveal-pw").hide();
      $(".hide-pw").show();
    }
    if (!!$el.closest(".hide-pw").get(0)) {
      let signin_input = $("#d-signin-pass");
      signin_input.attr("type", "password");
      $(".reveal-pw").show();
      $(".hide-pw").hide();
    }
  }



  async function wrapKeyUpHandler(event) {
    if (event.keyCode === 13) {
      var $el = $(event.target);
      if (!!$el.closest("#d-signin-email").get(0)) {
        $("#d-signin-pass").bind.focus();
      }
      if (!!$el.closest("#d-signin-pass").get(0)) {
        if (
          (await supabaseSignIn(email, password)) &&
          valEmail &&
          valPassword
        ) {
          // console.log(await supabaseSignIn(email, password));
          router.push("/");
        } else {
          $(".validator-message").text("Invalid Signin Attempt");
        }
      }
    }
  }

  useEffect(() => {

    document.getElementById('signin-div').addEventListener('change', wrapChangeHandler)
    function wrapChangeHandler(event) {
      // console.log('change');
      var $el = $(event.target);
      if (!!$el.closest("#d-signin-email").get(0)) {
        setEmail($el.closest("#d-signin-email").val());
        $(".validator-message").text("");
        // console.log($el.closest("#d-signin-email").val());
      }
      if (!!$el.closest("#d-signin-pass").get(0)) {
        setPassword($el.closest("#d-signin-pass").val());
        $(".validator-message").text("");
      }
    }
  }, [])

  return (
    <>
      {/* <Head>
        {parseHtml(props.headContent, parseOptions)}
      </Head> */}
      <div
        id="signin-div"
        onClick={wrapClickHandler}
        // onChange={wrapChangeHandler}
        onKeyUp={wrapKeyUpHandler}
      >


        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

Signin.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
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

  const bodyContent = $(`.main-wrapper`).html();
  const headContent = $(`head`).html();

  return {
    props: {
      bodyContent,
      headContent,
    },
  };
}
