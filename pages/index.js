import parseHtml, { domToReact } from "html-react-parser";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import NavbarContent from "./navbar";
import Script from "next/script";
import $ from "jquery";
import Head from "next/head";
import { useUser } from "../lib/authInfo";
// import { replace } from "../utils/replace-node";
import { useRouter } from "next/router";
import { log } from "logrocket";

export default function Home(props) {
  let [auth, setAuth] = useState(supabase.auth.session());
  let [headContent, setheadContent] = useState(props.headContent);
  let [navBar, setnavbar] = useState(props.navBar);
  let [blog, setBlog] = useState(props.showBlog);
  let [illusHead, setIllusHead] = useState(props.illustrationHead);
  let [illusHeadLogin, setIllusHeadLogin] = useState("");
  let [showFree, setShowfree] = useState(props.showFree);
  let [PremiumUser, setPremiumUser] = useState("inactive");
  let [hideLogin, setHideLogin] = useState(props.hideLogin);
  let [supportScripts, setsupportScripts] = useState(props.supportScripts);
  const { user, setUser } = useUser();
  supabase.auth.onAuthStateChange((event, session) => {
    setAuth(supabase.auth.session());
  });
  console.log(user);
  const router = useRouter();

  function replace(node) {
    const attribs = node.attribs || {};
    if (attribs.hasOwnProperty("class")) {
      attribs["className"] = attribs["class"];
      delete attribs.class;
    }

    // Replace links with Next links
    if (node.name == "div") {
      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("contact-form-hero")) {
          return (
            <div
              {...props}
              dangerouslySetInnerHTML={{
                __html: ` <form
                      id="wf-form-form-home"
                      name="wf-form-form-home"
                      data-name="form-home"
                      method="get"
                      class="contact-form responsive-grid"
                      aria-label="form-home"
                    >
                      <div
                        id="w-node-_6e04061e-ac3d-547e-dce7-8a022d94f7de-0820319e"
                        class="hero-input-field"
                        style="border: 1px solid rgb(204, 209, 214)"
                      >
                        <img
                          loading="lazy"
                          src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c07172dd663_Profile.svg"
                          alt="profile"
                          class="user-icon"
                        />
                        <input
                          type="text"
                          class="text-field w-input"
                          maxlength="256"
                          name="Name"
                          data-name="Name"
                          placeholder="Your full name"
                          id="Name-3"
                          required=""
                        />
                      </div>
                      <div
                        id="w-node-_6e04061e-ac3d-547e-dce7-8a022d94f7e1-0820319e"
                        class="hero-input-field"
                      >
                        <img
                          loading="lazy"
                          src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c74572dd666_Email.svg"
                          alt="Email"
                          class="user-icon"
                        />
                        <input
                          type="email"
                          class="text-field w-input"
                          maxlength="256"
                          name="Email"
                          data-name="Email"
                          placeholder="Your email"
                          id="Email"
                          required=""
                        />
                      </div>
                      <div
                        id="w-node-_742b536b-b539-2c95-f8ba-7b2c6f8198e3-0820319e"
                        data-w-id="742b536b-b539-2c95-f8ba-7b2c6f8198e3"
                        class="button-wrap home-form"
                      >
                        <div class="btn-primary">
                          <div>Submit</div>
                          <input
                            type="submit"
                            value="Submit"
                            data-wait="Please wait..."
                            class="submit-button w-button"
                          />
                          <img
                            loading="lazy"
                            src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c2bb32dd5f5_Arrows.svg"
                            alt=""
                            class="button-icon"
                          />
                        </div>
                        <div class="btn-overlay"></div>
                      </div>
                    </form>`,
              }}
            ></div>
          );
        }
      }
    }

    if (node.name == "section") {
      const { ...props } = attribs;
      if (props.className) {
        if (props.className.includes("section-home_hero")) {
          if (supabase.auth.session()) {
            return <div></div>;
          }
        }
        if (props.className.match(/^section-brands$/)) {
          if (supabase.auth.session()) {
            return <div></div>;
          }
        }
      }
    }

    if (node.name == `a`) {
      let { href, style, ...props } = attribs;
      if (href) {
        if (
          href.includes("/illustration-types/") ||
          href.includes("/illustration-categories/") ||
          href.includes("/single-illustrations/") ||
          (href.includes("/illustrations") &&
            !props.className.includes("upgrade-plan-link "))
        ) {
          // console.log(href.slice(href.lastIndexOf("/"), href.length));
          return (
            <Link
              href={"/product" + href.slice(href.lastIndexOf("/"), href.length)}
            >
              <a {...props}>
                {!!node.children &&
                  !!node.children.length &&
                  domToReact(node.children, parseOptions)}
              </a>
            </Link>
          );
        }
        if (attribs.className) {
          if (props.className.includes("upgrade-plan-link ")) {
            console.log(node.children[2].children[0].data);

            if (!supabase.auth.session()) {
              // not sigedin user
              return (
                <Link href="/plans">
                  <a {...props}>
                    <div className="upgradedownload">Upgrade Your Plan</div>
                    {!!node.children &&
                      !!node.children.length &&
                      domToReact([node.children[1]], parseOptions)}
                  </a>
                </Link>
              );
            } else {
              if (
                node.children[2].children[0].data == "Premium" &&
                user.subscription_details.status != "active"
              ) {
                return (
                  <Link href="/plans">
                    <a {...props}>
                      <div className="upgradedownload">Upgrade Your Plan</div>
                      {!!node.children &&
                        !!node.children.length &&
                        domToReact([node.children[1]], parseOptions)}
                    </a>
                  </Link>
                );
              } else {
                return (
                  //download
                  <Link href={href}>
                    <a {...props}>
                      <div className="upgradedownload">Download Now</div>
                      {!!node.children &&
                        !!node.children.length &&
                        domToReact([node.children[1]], parseOptions)}
                    </a>
                  </Link>
                );
              }
            }
          } else {
            return (
              <Link href={href}>
                <a {...props}>
                  {!!node.children &&
                    !!node.children.length &&
                    domToReact(node.children, parseOptions)}
                </a>
              </Link>
            );
          }
        }

        return (
          <Link href={href}>
            <a {...props}>
              {!!node.children &&
                !!node.children.length &&
                domToReact(node.children, parseOptions)}
            </a>
          </Link>
        );
      }
    }
    // Make Google Fonts scripts work
    if (node.name === `script`) {
      let content = get(node, `children.0.data`, ``);

      if (content && content.trim().indexOf(`WebFont.load(`) === 0) {
        content = `setTimeout(function(){${content}}, 1)`;
        return (
          <Script
            {...attribs}
            dangerouslySetInnerHTML={{ __html: content }}
          ></Script>
        );
      } else {
        <Script
          {...attribs}
          dangerouslySetInnerHTML={{ __html: content }}
          strategy="lazyOnload"
        ></Script>;
      }
    }
    const { href, style, ...props } = attribs;
  }

  const parseOptions = {
    replace,
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      $('.cancel,.request-popup').click(function(){
        $('.request-popup').hide();
          $('#loader').show()
           $('.iframe-holder').hide()
        })
    }
  },[])

  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest(".request").get(0)) {
      console.log($el)
      $(".request-popup").show();
      setTimeout(function () {
        $("#loader").hide();
        $(".iframe-holder").show();
      }, 3000);

    }
    
  }

  // if (supabase.auth.session()) {
  //   let uid = supabase.auth.session().user.id;
  //   supabase
  //     .from("stripe_users")
  //     .select("stripe_user_id")
  //     .eq("user_id", uid)
  //     .then(({ data, error }) => {
  //       fetch("api/check-active-status", {
  //         method: "POST",
  //         headers: {
  //           contentType: "application/json",
  //         },
  //         body: JSON.stringify({ customer: data[0].stripe_user_id }),
  //       })
  //         .then(function (response) {
  //           return response.json();
  //         })
  //         .then(function (data) {
  //           setPremiumUser(data.status);
  //         });
  //     });
  // }

  // (async()=>{  const { user, error } = await supabase.auth.signUp({
  //     email: 'subrahmanyagt@gmail.com',
  //     password:'1234567890'
  //   })
  //   console.log(user,error);
  // })()

  // (async ()=>{
  //   const datas=await supabase.auth.verifyOTP({
  //     email:'subrahmanyagt@gmail.com',
  //     token:'vpqiv-vbvff-snxeb-ymsjm',
  //     type:'signup',
  //   })
  // console.log(datas)})()

  return (
    <div onClick={wrapClickHandler}>
      {auth == null ? parseHtml(hideLogin, parseOptions) : null}
      {auth == null
        ? parseHtml(illusHeadLogin, parseOptions)
        : parseHtml(props.illustrationHeadLogin, parseOptions)}

      {auth == null ? parseHtml(illusHead, parseOptions) : null}
      {auth == null ? (
        parseHtml(props.HomeIllustration, parseOptions)
      ) : (
        <div className="l">
          {parseHtml(props.HomeIllustration, parseOptions)}
        </div>
      )}
      {parseHtml(showFree, parseOptions)}
      {auth == null ? (
        <div className="showCaseBeforLogin">
          {parseHtml(props.showcase, parseOptions)}
        </div>
      ) : (
        <div className="showCaseAfterLogin">
          {parseHtml(props.showcase, parseOptions)}
        </div>
      )}

      {auth == null ? null : parseHtml(blog, parseOptions)}
      {parseHtml(props.allShow, parseOptions)}
      {/* </div> */}
      {/* <Script strategy="lazyOnload" id="jetboost-script" type="text/javascript" src='https://cdn.jetboost.io/jetboost.js' async  onError={(e) => {
          console.error('Script failed to load', e)
        }}></Script> */}
    </div>
  );
}

/** data fetching  from w-drawkit site*/
export async function getServerSideProps() {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const webUrl = "https://drawkit-v2.webflow.io/";
  const res = await axios(webUrl);
  const html = res.data;
  const $ = cheerio.load(html);

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
  const navBar = $(".nav-access").html();
  const globalStyles = $(".global-styles").html();
  const LoggedinnavBar = $(`.logged-in-user-nav`).html();
  const hideLogin = $(`.hide-login`).html();
  const homeIllustration = $(`.show-all-illustration`).html();
  const showFree = $(`.show-free`).html();
  const showcase = $(`.showcase`).html();
  const illustrationHeadLogin = $(`.after-login-heading`).html();
  const illustrationHead = $(".before-login-heading").html();
  const showBlog = $(`.show-blogs-login`).html();
  const allShow = $(`.show-all`).html();
  const headContent = $(`head`).html();
  const footer = $(`.footer-access`).html();

  return {
    props: {
      headContent: headContent,
      globalStyles: globalStyles,
      supportScripts: supportScripts,
      navBar: navBar,
      hideLogin: hideLogin,
      LoggedinnavBar: LoggedinnavBar,
      footer: footer,
      showFree: showFree,
      showcase: showcase,
      showBlog: showBlog,
      illustrationHeadLogin: illustrationHeadLogin,
      illustrationHead: illustrationHead,
      HomeIllustration: homeIllustration,
      showFree: showFree,
      allShow: allShow,
    },
  };
}
