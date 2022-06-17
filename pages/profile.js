import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { supabase } from "../utils/supabaseClient";
import { replace } from "../utils/replace-node";
import JSZip from "jszip";
import FileSaver from "file-saver";
import NavbarContent from "./navbar";

export default function Illustration(props) {
  const parseOptions = { replace };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (supabase.auth.session() != null) {
      supabase
        .from("user_profile")
        .select()
        .eq("user_id", supabase.auth.session().user.id)
        .then(({ data, error }) => {
          if (data.length > 0) {
            setFirstName(data[0].first_name);
            setLastName(data[0].last_name);
          }
        });
    }
  }, []);
  useEffect(() => {
    if (supabase.auth.session() != null) {
    document.getElementById("first-name").value = firstName;
    document.getElementById("last-name").value = lastName;
    }
  }, [firstName, lastName]);
  console.log(firstName, lastName);
  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#save-changes").get(0)) {
      if (!!firstName && !!lastName) {
        supabase
          .from("user_profile")
          .upsert(
            {
              first_name: firstName,
              last_name: lastName,
              user_id: supabase.auth.session().user.id,
            },
            { onConflict: "user_id" }
          )
          .then(({ data, error }) => {
            if (error) {
              alert(error.message);
            } else {
              alert("Changes has been successfully updated");
            }
          });
      }
    }
  }

  async function wrapChangeHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#first-name").get(0)) {
      setFirstName($el.closest("#first-name").val());
      console.log(firstName);
    }
    if (!!$el.closest("#last-name").get(0)) {
      setLastName($el.closest("#last-name").val());
      console.log(lastName);
    }
  }

  return supabase.auth.session() != null ? (
    <>
      <Head>{parseHtml(props.headContent)}</Head>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        <NavbarContent navbarContent={parseHtml(props.navBar, parseOptions)} />

        {parseHtml(props.bodyContent, parseOptions)}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
        {parseHtml(props.supportScripts, parseOptions)}
        {parseHtml(props.footer, parseOptions)}
        {parseHtml(props.globalStyles, parseOptions)}
      </div>
    </>
  ) : (
    ""
  );
}

export const getServerSideProps = async (paths) => {
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res;

  res = await axios(`https://drawkit-v2.webflow.io/profile`).catch((err) => {
    console.error(err);
  });

  if (res) {
    const html = res.data;
    const $ = cheerio.load(html);
    const navBar = $(`.navbar`).html();
    const bodyContent = $(`.main-wrapper`).html();
    const headContent = $(`head`).html();
    const footer = $(`.footer-access`).html();
    const globalStyles = $(".global-styles").html();

    const supportScripts = Object.keys($(`script`))
      .map((key) => {
        if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
      })
      .filter((src) => {
        if (src) return src;
      })
      .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
      .join("");

    return {
      props: {
        bodyContent: bodyContent,
        headContent: headContent,
        navBar: navBar,
        supportScripts: supportScripts,
        footer: footer,
        globalStyles: globalStyles,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/400",
        permanent: false,
      },
    };
  }
};
