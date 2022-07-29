import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { replace } from "../utils/replace-node";


// const { user, error } = await supabase.auth.api
//   .resetPasswordForEmail('subrahmanyagt@gmail.com')
const changePassword = async (password) => {
  // console.log(email);
  const resp = await supabase.auth.update({
    password: password,
  });
  // const { error, data } = await supabase.auth.api.updateUser(accessToken, {
  //   password: password,
  // });

  return resp;

};

export default function ChangePassword(props) {
  const parseOptions = {
    replace,
  };
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  // constp[errorMsg, setErrorMsg] =useState("");


  async function wrapClickHandler(event) {

    
    let pass = document.querySelector('#new-password');
    pass.addEventListener('change', () => {
      setPassword(pass.value)
    })
    let compass = document.querySelector('#confirm-password');
    compass.addEventListener('change', () => {
      setConfPassword(compass.value)
    })


    var $el = $(event.target);

    if (!!$el.closest("#new-pwd-revel").get(0)) {
      let signin_input = $("#new-password");
      signin_input.attr("type", "text");
      $("#new-pwd-revel").hide();
      $("#hide-pwd-revel").show();
    }
    if (!!$el.closest("#hide-pwd-revel").get(0)) {
      let signin_input = $("#new-password");
      signin_input.attr("type", "password");
      $("#new-pwd-revel").show();
      $("#hide-pwd-revel").hide();
    }

    if (!!$el.closest("#revel-pwd-confirm").get(0)) {
      let signin_input = $("#confirm-password");
      signin_input.attr("type", "text");
      $("#revel-pwd-confirm").hide();
      $("#confirm-pwd-hide").show();
    }
    if (!!$el.closest("#confirm-pwd-hide").get(0)) {
      let signin_input = $("#confirm-password");
      signin_input.attr("type", "password");
      $("#revel-pwd-confirm").show();
      $("#confirm-pwd-hide").hide();
    }

    if (!!$el.closest("#reset").get(0)) {
      //console.log(password)
      //console.log(confpassword)
      if (password === confpassword && password.length >= 8) {
        const resp = await changePassword(password)
        if (!resp.error) {
          $(".reset-message-popup").css("display", "block");
          $(".validator-message").text("");
        }
        else {
          $(".validator-message").text(resp.error.message);
        }
      }
      else {
        $(".validator-message").text("Please make sure your Passwords match it should be minimum 8 Characters");
      }
      // router.push('/signin')
    }

  }


  return (
    <>
      <Head>
        {parseHtml(props.headContent, parseOptions)}
      </Head>
      <div onClick={wrapClickHandler}>
        {parseHtml(props.bodyContent, parseOptions)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}
ChangePassword.getLayout = function PageLayout(page) {
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

  let res = await axios("https://drawkit-v2.webflow.io/change-password ").catch((err) => {
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
