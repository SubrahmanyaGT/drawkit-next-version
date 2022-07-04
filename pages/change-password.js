import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

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
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  // constp[errorMsg, setErrorMsg] =useState("");


  async function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#reset").get(0)) {
      if (password === confpassword && password.length >= 8) {
        const resp=await changePassword(password)
        if (!resp.error) {
          $(".reset-message-popup").css("display", "block");
          $(".validator-message").text("");
        }
        else{
          $(".validator-message").text(resp.error.message);
        }
      }
      else{
        $(".validator-message").text("Please make sure your Passwords match"); 
      }
      // router.push('/signin')
    }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#new-password").get(0)) {
      setPassword($el.closest("#new-password").val());
      $(".validator-message").text("");
    }
    if (!!$el.closest("#confirm-password").get(0)) {
      setConfPassword($el.closest("#confirm-password").val());
      $(".validator-message").text("");
    }
  }
  return (
    <>
    <Head>
        {parseHtml(props.headContent)}
      </Head>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {parseHtml(props.bodyContent)}
      </div>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
    </>
  );
}
ChangePassword.getLayout=function PageLayout(page){
  return(
    <>
   
    {page}
    </>
  )
}

export async function getStaticProps({ context }) {
  // console.log(context,'ctx');
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios(
    "https://drawkit-v2.webflow.io/change-password  "
  ).catch((err) => {
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
