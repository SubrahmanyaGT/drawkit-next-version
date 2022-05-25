import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const supabaseSignOut = async (email, password) => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
        location.reload
    }
};



export default function Navbar(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  function wrapClickHandler(event) {
    var $el = $(event.target);
    if (!!$el.closest("#logout-button").get(0)) {
        supabaseSignOut();
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
  return (
    <>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {props.navbarContent}
      </div>
      {
        // parseHtml(props.navDrop)
      }
    </>
  );
}
