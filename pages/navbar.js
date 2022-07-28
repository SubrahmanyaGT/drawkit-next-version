import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Router from "next/router";
import $ from "jquery";
import useSWR from "swr";
import Script from "next/script";

const supabaseSignOut = async (email, password) => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = window.location.origin;
  }
};

// let script = ()=>{
//   let scriptsapi=fetch('api/navbar').then(function (response ){return response.json()}).then( ({supportScripts})=>{return (supportScripts.map((sc)=>{return `<Script src=${sc}></Script>`}));});
// return scriptsapi;
// }
// const fetcher = () => fetch("api/navbar").then((res) => res.json());

export default function NavbarContent(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-nav-signout").get(0)) {
      event.preventDefault();
      supabaseSignOut();
    }

    if (!!$el.closest("#search-close").get(0)) {
      $("#nav-search-input").val("");
      $("#close").hide();
    }
    if (!!$el.closest("#search").get(0)) {
      let params = "/search-results?search=" + $("#nav-search-input").val();
      router.push(params);
    }
     
    if (!!$el.closest("#search-close-mbl-signout").get(0)) {
      $("#nav-search-input-mbl-signout").val("");
      $("#search-close-mbl-signout").hide();
    }
    if (!!$el.closest("#search-submit-signout").get(0)) {
      let params = "/search-results?search=" + $("#nav-search-input-mbl-signout").val();
      router.push(params);
    }
    if (!!$el.closest("#account").get(0)) {
      window.location.pathname = "/profile";
    }
    if (!!$el.closest("#user-name").get(0)) {
      $(".my-profile-wrap").show();
    } else {
      $(".my-profile-wrap").hide();
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

  function wrapKeyUpHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#nav-search-input").get(0)) {
      if ($("#nav-search-input").val().length > 0) {
        $("#close").show();
      } else {
        $("#close").hide();
      }
    }

    if (event.keyCode === 13) {
      if (!!$el.closest("#nav-search-input").get(0)) {
        if ($("#nav-search-input").val().length > 0) {
          let params = "/search-results?search=" + $("#nav-search-input").val();
          router.push(params);
        }
      }
    }
       //Mobile Search
    // if (!!$el.closest("nav-search-input-mbl-signout").get(0)) {
      
      
    // }
  
    if (event.keyCode === 13) {
      event.preventDefault()
      if (!!$el.closest("#nav-search-input-mbl-signout").get(0)) {
        if ($("#nav-search-input-mbl-signout").val().length > 0) {
          let params = "/search-results?search=" + $("#nav-search-input-mbl-signout").val();
          router.push(params);
        }
      }
    }
    else{
      if ($("#nav-search-input-mbl-signout").val().length > 0) {
        $("#search-close-mbl-signout").show();
      } else {
        $("#search-close-mbl-signout").hide();
      }
    }

  }
 
  function wrapBlurHandler(event) {
    var $el = $(event.target);
    if (!$el.closest("#account-link-text").get(0)) $(".my-profile-wrap").hide();
  }
  function wrapFocusHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#user-name").get(0)) {
      $(".my-profile-wrap").show();
    }
  }
  // const { data = {}, error } = useSWR("/api/profile-data", fetcher);

  // if (data.supportScripts) {
  //   data.supportScripts.map((src) => {
  //     return <Script src={src}></Script>;
  //   });
  // }
  // console.log(data.map((src)=>{returnn` <Script src=${src}></script>`}));
  return (
    <div
      tabIndex="100"
      onClick={wrapClickHandler}
      onChange={wrapChangeHandler}
      onKeyUp={wrapKeyUpHandler}
      onBlur={wrapBlurHandler}
      onFocus={wrapFocusHandler}
      suppressHydrationWarning={true}
      style={{
        border: "none",
        position: "fixed",
        zIndex: 999,
        backgroundColor: "white",
        width: "100%",
        top: "0",
      }}
    >
      <>{props.navbarContent}</>
    </div>
  );
}
