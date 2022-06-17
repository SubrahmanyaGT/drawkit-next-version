import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";

const supabaseSignUp = async (email, password) => {
  let stripeCreate = await (async () => {
    const response = await fetch("api/createStripCust", {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({ email: email, name: email }),
    });
    if (response.ok) {
      const { data } = await response.json();
      return data;
    } else {
      return false;
    }
  })();
  let supabaseCreate = await (async () => {
    let supabaseuser = new Promise(async function (resolve, reject) {
      if (!stripeCreate.errors && !!stripeCreate.customer) {
        let supabaseuserPromise = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (!supabaseuserPromise.error) {
          resolve(supabaseuserPromise);
        } else {
          reject(false);
        }
      }
    });

    return await supabaseuser;
  })();
  let storeUser = await (async () => {
    if (supabaseCreate.user) {
      let stripeuser = await supabase.from("stripe_users").insert([
        {
          stripe_user_id: stripeCreate.customer.id,
          stripe_user_email: stripeCreate.customer.email,
          user_id: supabaseCreate.user.id,
        },
      ]);
      return stripeuser;
    } else {
      return false;
    }
  })();
  return !storeUser.error && !supabaseCreate.error && !stripeCreate.errors
    ? true
    : false;
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
          let data = await supabaseSignUp(email, password);
          console.log("data", data);
          if (data) {
            router.push("/");
          } else {
            console.log("asdfadf");
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
    if (!!$el.closest(".reveal-pw").get(0)) {
      let signin_input=$("#d-signup-pass")
       signin_input.attr('type','text');
                $(".reveal-pw").hide();
                $(".hide-pw").show();
      }
    if (!!$el.closest(".hide-pw").get(0)) {
      
     
      let signin_input=$("#d-signup-pass")
       signin_input.attr('type','password');
                $(".reveal-pw").show();
                $(".hide-pw").hide();
      }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#field").get(0)) {
      setEmail($el.closest("#field").val());
    }
    if (!!$el.closest("#d-signup-pass").get(0)) {
      setPassword($el.closest("#d-signup-pass").val());
    }
  }

  async function wrapKeyUpHandler(event) {
    if (event.keyCode === 13) {
      var $el = $(event.target);
      if (!!$el.closest("#field").get(0)) {
        $("#d-signup-pass").focus();
      }
      if (!!$el.closest("#d-signup-pass").get(0)) {
        validateEmailPassword();
      console.log(email, password);

      if (valEmail && valPassword) {
        if ($(".w-checkbox-input").hasClass("w--redirected-checked")) {
          let data = await supabaseSignUp(email, password);
          console.log("data", data);
          if (data) {
            router.push("/");
          } else {
            console.log("asdfadf");
          }
        } else {
          $(".w-checkbox-input").css("border", "1px solid red");
        }
      }
      }
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
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler} onKeyUp={wrapKeyUpHandler}>
        {parseHtml(props.headContent)}
        {parseHtml(props.bodyContent)}
        {parseHtml(props.supportScripts)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}

export async function getServerSideProps({ context }) {
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
      bodyContent: bodyContent,
      headContent: headContent,
      supportScripts: supportScripts,
    },
  };
}
