import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";

const supabaseSignUp = async (email, password) => {
  const { user, session, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (!error) {
    return true;
  } else {
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
  const [valEmail, setValEmail] = useState(false);
  const [valPassword, setValPassword] = useState(false);
  const router = useRouter();

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

  /**Functions */
  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#signup").get(0)) {
      validateEmailPassword();
      console.log(email, password);

      if (valEmail && valPassword) {
        if ($(".w-checkbox-input").hasClass("w--redirected-checked")) {
          if (await supabaseSignUp(email, password)) {
            router.push("/");
          }
        } else {
          $(".w-checkbox-input").css("border", "1px solid red");
        }
      }
    }
    if (!!$el.closest("#d-signup-google").get(0)) {
      signInWithGoogle();
    }

    if (!!$el.closest(".w-checkbox").get(0)) {
      if ($(".w-checkbox-input").hasClass("w--redirected-checked")) {
        $(".w-checkbox-input").css("border", "1px solid red");
      } else {
        $(".w-checkbox-input").css("border", "1px solid #ccc");
      }
    }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-signup-email").get(0)) {
      setEmail($el.closest("#d-signup-email").val());
    }
    if (!!$el.closest("#d-signup-pass").get(0)) {
      setPassword($el.closest("#d-signup-pass").val());
    }
  }

  function validateEmailPassword() {
    if (valPassword) {
      // $("#d-signup-pass").parent().css("border", "1px solid #ccd1d6");
      if (valEmail) $(".validator-message").text("");
    } else {
      // $("#d-signup-pass").parent().css("border", "1px solid red");
      $(".validator-message").text("Invalid input for Email or Password");
    }
    if (valEmail) {
      // $("#d-signup-email").parent().css("border", "1px solid #ccd1d6");
      if (valPassword) $(".validator-message").text("");
    } else {
      // $("#d-signup-email").parent().css("border", "1px solid red");
      $(".validator-message").text("Invalid input for Email or Password");
    }
  }
  return (
    <>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {parseHtml(props.headContent)}
        {parseHtml(props.bodyContent)}
        {parseHtml(props.supportScripts)}
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
  // $("").replaceWith("<div onClick={myFunction}> connect</div>");
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

  console.log($("#d-signup-button")[0]);
  const bodyContent = $(`.page-wrapper`).html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
      supportScripts: supportScripts,
    },
    revalidate: 3,
  };
}
