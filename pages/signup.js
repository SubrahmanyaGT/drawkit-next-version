import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { replace } from "../utils/replace-node";

const supabaseSignUp = async (email, password) => {
  // console.log(email, password);

  let Supabaseuser = await supabase.auth.signUp({
    email: email,
    password: password,
  });



  return Supabaseuser;

  // return { storeUser, supabaseCreate, stripeCreate };
  // return !storeUser.error && !supabaseCreate.error && !stripeCreate.errors
  //   ? true
  //   : false;
};

async function signInWithGoogle() {
  // const { user, session, error } = await
  supabase.auth
    .signIn({
      provider: "google",
    })
}
export default function Signup(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valEmail, setValEmail] = useState(false);
  const [valPassword, setValPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const parseOptions = {
    replace,
  };
  useEffect(() => {
    if (loader)
      document.getElementById('loaderWrapper').innerHTML = `<div class="button-wrap signup">
      <div class="btn-primary align-bottom"><div>Loading... <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div></div>
      <div class="btn-overlay"></div>
    </div>`
    else
      document.getElementById('loaderWrapper').innerHTML = `<div id="signup" class="button-wrap signup">
    <div class="btn-primary"><div>Sign Up</div></div>
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

  /**Functions */

  useEffect(() => {
    document
      .getElementById("signup-div")
      .addEventListener("change", wrapChangeHandler);

    function wrapChangeHandler(event) {
      var $el = $(event.target);
      if (!!$el.closest("#signup-name").get(0)) {
        setEmail($el.closest("#signup-name").val());
      }
      if (!!$el.closest("#d-signup-pass").get(0)) {
        setPassword($el.closest("#d-signup-pass").val());
      }
      if (!!$el.closest("#d-signup-checkbox").get(0)) {
        if ($("#d-signup-checkbox").is(":checked")) {
          $(".w-checkbox-input").addClass("w--redirected-checked");
          $(".w-checkbox-input").css("box-shadow", "0 0 3px 1px #3898ec");
        } else {
          $(".w-checkbox-input").removeClass("w--redirected-checked");
        }
      }
    }
  }, []);
  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#signup").get(0)) {
      validateEmailPassword();
      // console.log(email, password);

      if (valEmail && valPassword) {
        if ($("#d-signup-checkbox").is(":checked")) {
          //make loader true
          setLoader(true);
          let Supabaseuser = await supabaseSignUp(email, password);
          // console.log("data", Supabaseuser);

          if (!Supabaseuser.error) {
            //make loader false or at page load
            // setLoader(false)
            router.push({
              pathname: "/verification",
              query: { email: email },
            });
          } else {
            $(".validator-message").text(Supabaseuser.error.message);
            //make loader false
            setLoader(false)
          }
        } else {
          $(".w-checkbox-input").css("box-shadow", "0 0 3px 1px red");
        }
      }
    }
    if (!!$el.closest("#d-signup-google").get(0)) {
      await signInWithGoogle();
    }

    if (!!$el.closest(".w-checkbox").get(0)) {
      if ($(".w-checkbox-input").hasClass("w--redirected-checked")) {
        $(".w-checkbox-input").css("border", "1px solid red");
      } else {
        $(".w-checkbox-input").css("border", "1px solid #ccc");
      }
    }
    if (!!$el.closest(".reveal-pw").get(0)) {
      let signin_input = $("#d-signup-pass");
      signin_input.attr("type", "text");
      $(".reveal-pw").hide();
      $(".hide-pw").show();
    }
    if (!!$el.closest(".hide-pw").get(0)) {
      let signin_input = $("#d-signup-pass");
      signin_input.attr("type", "password");
      $(".reveal-pw").show();
      $(".hide-pw").hide();
    }
  }

  async function wrapKeyUpHandler(event) {
    if (event.keyCode === 13) {
      var $el = $(event.target);
      if (!!$el.closest("#signup-name").get(0)) {
        $("#d-signup-pass").focus();
      }
      if (!!$el.closest("#d-signup-pass").get(0)) {
        validateEmailPassword();
        // console.log(email, password);

        if (valEmail && valPassword) {
          if ($(".w-checkbox-input").hasClass("w--redirected-checked")) {
            let data = await supabaseSignUp(email, password);
            // console.log("data", data);
            if (data) {
              router.push("/");
            } else {
              // console.log("asdfadf");
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
      <div
        id="signup-div"
        onClick={wrapClickHandler}
        onKeyUp={wrapKeyUpHandler}
      >
        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}
Signup.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

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

  // console.log($("#d-signup-button")[0]);
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
