import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const supabaseSignUp = async () => {
  const { user, session, error } = await supabase.auth.signUp({
    email: "subrahmanyagt@gmail.com",
    password: "example-password",
  });
  if (!error) {
    alert("signup successful");
  }
};

export default function Home(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      {parseHtml(props.headContent)}
      {parseHtml(props.bodyContent)}
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

   console.log( $("#d-signup-button"));
      
      

//   console.log($('body').find('#d-signup-button').click(function(){console.log('working');}));

    // $('#d-signup-button').each(function (element) {
    //       console.log(element.);
    //  })

  //   $("#d-signup-email")
  //     .html()
  //     .addEventListener("change", (event) => {
  //       setEmail(event.target.value);
  //     });
  //   $("#d-signup-pass")
  //     .html()
  //     .addEventListener("change", (event) => {
  //       setPassword(event.target.value);
  //     });
  const bodyContent = $(`.page-wrapper`).html();
  const headContent = $(`head`).html();
  return {
    props: {
      bodyContent,
      headContent,
    },
    revalidate: 3,
  };
}
