import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import Router from "next/router";

const supabaseSignOut = async (email, password) => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    Router.reload();
  }
};

export default function NavbarContent(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#logout-button").get(0)) {
      supabaseSignOut();
    }

    if (!!$el.closest("#search-close").get(0)) {
      $("#nav-search-input").val("");
      $("#close").hide(); 
    }
    if (!!$el.closest("#search").get(0)) {
      let params ="/search-results?search="+ $("#nav-search-input").val();
       router.push(params)
    }
  }

  function wrapChangeHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#d-signin-email").get(0)) {
      setEmail($el.closest("#d-signin-email").val());
      console.log("password changed", email);
    }
    if (!!$el.closest("#d-signin-pass").get(0)) {
      setPassword($el.closest("#d-signin-pass").val());
      console.log("password changed", password);
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
  }
  return (
    <>
      <div
        onClick={wrapClickHandler}
        onChange={wrapChangeHandler}
        onKeyUp={wrapKeyUpHandler}
      >
        {props.navbarContent}
      </div>
      {
        // parseHtml(props.navDrop)
      }
    </>
  );
}
