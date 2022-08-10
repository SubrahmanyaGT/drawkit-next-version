import Head from "next/head";
import Link from "next/link";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import { supabase } from "../utils/supabaseClient";
import Script from "next/script";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import NavbarContent from "./navbar";
import { replace } from "../utils/replace-node";
import { useUser } from "../lib/authInfo";
import $ from "jquery";

export default function Plans(props) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [premiumUser, setPremiumUser] = useState("inactive");
  let [auth, setAuth] = useState(supabase.auth.session());
  //console.log(router);

  //console.log(user);
  // useEffect(() => {
  //   if (supabase.auth.session()) {
  //     let uid = supabase.auth.session().user.id;
  //     supabase
  //       .from("stripe_users")
  //       .select("stripe_user_id")
  //       .eq("user_id", uid)
  //       .then(({ data, error }) => {
  //         fetch("api/check-active-status", {
  //           method: "POST",
  //           headers: {
  //             contentType: "application/json",
  //           },
  //           body: JSON.stringify({ customer: data[0].stripe_user_id }),
  //         })
  //           .then(function (response) {
  //             return response.json();
  //           })
  //           .then(function (data) {
  //             setUser({ foreground: data.status, background: "#" });
  //           });
  //       });
  //   }
  // }, []);
  console.log(user.subscription_details.status);
  const parseOptions = { replace };

  // useEffect(() => {
  //   if (supabase.auth.session()) {
  //     fetch("/api/check-active-status", {
  //       method: "POST",
  //       headers: {
  //         contentType: "application/json",
  //       },
  //       body: JSON.stringify({ user_id: auth.user.id }),
  //     })
  //       .then(function (response) {
  //         return response.json();
  //       })
  //       .then(function (data) {
  //         console.log(data);
  //         setPremiumUser(data.status);
  //       });
  //   }
  // }, []);

  function wrapClickHandler(event) {
    // console.log('dheeraj')
    var $el = $(event.target);
    if (!!$el.closest("#subscribe").get(0))
     {
      if (auth != null) {
        fetch("/api/strip", {
          method: "POST",
          headers: {
            contentType: "application/json",
          },
          body: JSON.stringify({ user_id: auth.user.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.session.url) router.push(data.session.url);
            else alert(data.session.message);
          });
      } else {
        router.push("/signup");
      }
    }
  }

  function runSwiper() {
    var mySwiper = new Swiper("#basic-swiper", {
      slidesPerView: 3,
      slidesPerGroup: 1,
      grabCursor: true,
      a11y: false,
      spaceBetween: 28,
      allowTouchMove: true,
      navigation: {
        nextEl: "#right-button",
        prevEl: "#left-button",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        480: {
          /* when window >=0px - webflow mobile landscape/portriat */
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        767: {
          /* when window >= 767px - webflow tablet */ slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
        992: {
          /* when window >= 988px - webflow desktop */ slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 28,
        },
      },
    });
  }
  useEffect(() => {
    if (typeof Swiper !== "undefined") runSwiper();
  }, []);
  return (
    <>
      <div onClick={wrapClickHandler}>
        {parseHtml(props.headContent, parseOptions)}
        {auth == null ? (
          <div className="notLogedInPlans">
            {parseHtml(props.bodyContent, parseOptions)}
          </div>
        ) : user.subscription_details.status == "active" ? (
          <div className="primeInPlans">
            {parseHtml(props.bodyContent, parseOptions)}
          </div>
        ) : (
          <div className="freeUser">
            {parseHtml(props.bodyContent, parseOptions)}
          </div>
        )}
      </div>

      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      <Script
        src="https://unpkg.com/swiper/swiper-bundle.min.js"
        onLoad={runSwiper}
      ></Script>
    </>
  );
}

export async function getServerSideProps({ context }) {
  const cheerio = await import(`cheerio`);
  const axios = (await import(`axios`)).default;

  let res = await axios("https://drawkit-v2.webflow.io/plans").catch((err) => {
    console.error(err);
  });
  const html = res.data;

  const $ = cheerio.load(html);
  const globalStyles = $(".global-styles").html();
  const bodyContent = $(`.main-wrapper`).html();
  const navbarContent = $(".nav-access").html();
  const headContent = $(`head`).html();
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
  const footer = $(`.footer-access`).html();

  return {
    props: {
      bodyContent: bodyContent,
      headContent: headContent,
      navbarContent: navbarContent,
      supportScripts: supportScripts,
      footer: footer,
      globalStyles: globalStyles,
    },
  };
}
