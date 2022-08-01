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

const verifyOTP = async (token, email) => {
  const datas = await supabase.auth.verifyOTP({
    email: email,
    token: token,
    type: "signup",
  });
  return datas;
};
const createStripeUser = async (email, id) => {
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
  let storeUser = await (async () => {
    let stripeuser = await supabase.from("stripe_users").insert([
      {
        stripe_user_id: stripeCreate.customer.id,
        stripe_user_email: stripeCreate.customer.email,
        user_id: id,
      },
    ]);
    return stripeuser;
  })();

  let storeProfile = await (async () => {
    let userProfile = await supabase.from("user_profile").insert([
      {
        user_id: id,
      },
    ]);
    return userProfile;
  })();

  return { stripeCreate, storeUser, storeProfile };
};

export default function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valEmail, setValEmail] = useState(false);
  const [valPassword, setValPassword] = useState(false);
  const parseOptions = {
    replace,
  };
  const router = useRouter();
  // console.log(router.query.email);
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

  // console.log(supabase.auth);
  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#verify").get(0)) {
      const token = $("#verification-token").get(0).value;
      const userEmail = router.query.email;
      const verificationResult = await verifyOTP(token, userEmail);
      if (verificationResult.error) {
         document.querySelector('#verify-error-msg').innerText = "Invalid OTP"
        //$("#verify-error-msg").text(verificationResult.error.message);
      } else {
        // console.log(verificationResult);
        // console.log(
        //   await createStripeUser(
        //     verificationResult.user.email,
        //     verificationResult.user.id
        //   )
        // );
        router.push('/choose-subscription')
      }
    }
  }

  async function wrapKeyUpHandler(event) {
    const $el = $(event.target);
    if (event.keyCode === 13) {
      if (!!$el.closest("#verification-token").get(0)) {
      }
    } else {
      if (!!$el.closest("#verification-token").get(0)) {
        $("#verify-error-msg").text("");
      }
    }
  }

  useEffect(() => {
    document
      .getElementById("signin-div")
      .addEventListener("change", wrapChangeHandler);
    function wrapChangeHandler(event) {
      console.log("change");
      var $el = $(event.target);
      if (!!$el.closest("#d-signin-email").get(0)) {
        setEmail($el.closest("#d-signin-email").val());
        $(".validator-message").text("");
        console.log($el.closest("#d-signin-email").val());
      }
      if (!!$el.closest("#d-signin-pass").get(0)) {
        setPassword($el.closest("#d-signin-pass").val());
        $(".validator-message").text("");
      }
    }
  }, []);

  return (
    <>
      <Head>{parseHtml(props.headContent, parseOptions)}</Head>
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
  return <>{page}</>;
};

export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/verification").catch(
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
