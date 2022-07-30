import parseHtml, { domToReact } from "html-react-parser";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import NavbarContent from "./navbar";
import Script from "next/script";
import $, { type } from "jquery";
import Head from "next/head";
import { useUser } from "../lib/authInfo";
// import { replace } from "../utils/replace-node";
import { useRouter } from "next/router";
import { log } from "logrocket";
import { } from './navbar'

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
  let [favourites, setFavraties] = useState([]);
  const [types, setTypes] = useState([])
  const { user, setUser } = useUser();
  supabase.auth.onAuthStateChange((event, session) => {
    setAuth(supabase.auth.session());
  });
  //console.log(user);
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
            //console.log(node.children[2].children[0].data);

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
                  <Link href={href.replace("illustrations", "product")}>
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
    if (typeof window !== "undefined") {
      $(".cancel,.request-popup").click(function () {
        $(".request-popup").hide();
        $("#loader").show();
        $(".iframe-holder").hide();
      });

      if (auth) {
        (async () => {
          const { data, error } = await supabase
            .from("user_profile")
            .select()
            .eq("user_id", auth.user.id);
          if (data.length > 0 && data[0].liked_illustrations) {
            setFavraties(data[0].liked_illustrations);
          }
        })();
      }

    }
    // (async () => {
    //   const { data, error } = await supabase
    //     .from("illustration_type")
    //     .select('name')
    //   console.log('data1', data)
    //   data.forEach((ele) => {
    //     // console.log('typename', ele.name)
    //     types.push(ele.name)

    //   })
    // })();

  }, [router]);

  useEffect(() => {
    // console.log('allType', types)
    //heighlight the liked_illustrations
    let likeIcon = document.querySelectorAll(".like-buttons-wrap");
    likeIcon.forEach((icon) => {
      let wf_item_id = icon.children[0].innerText;
      if (favourites.includes(wf_item_id)) {
        //console.log(wf_item_id, icon);
        icon.children[1].innerHTML = `<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_i_81_74)">
        <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" fill="#E62020"></path>
        </g>
        <defs>
        <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
        <feOffset></feOffset>
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"></feBlend>
        </filter>
        </defs>
        </svg></div>`;
      } else {
        icon.children[1].innerHTML = `<div><img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62d14e0fd359cc7cd96e0e25_Like.svg" loading="lazy" alt=""/></div>`
      }
    });
    //console.log('useEffect testing')
  }, [favourites, router]);


  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest(".request").get(0)) {
      //console.log($el);
      $(".request-popup").show();
      setTimeout(function () {
        $("#loader").hide();
        $(".iframe-holder").show();
      }, 3000);
    }

    if ($el.closest(".like-buttons-wrap").get(0)) {
      let wf_item_id = $el.closest(".like-buttons-wrap").get(0)
        .children[0].innerText;
      //console.log(wf_item_id);
      if (auth) {

        if (favourites.length > 0) {
          let liked_illustrations = favourites;
          if (
            liked_illustrations.length > 0 &&
            liked_illustrations.includes(wf_item_id)
          ) {
            $el
              .closest(".like-buttons-wrap")
              .get(
                0
              ).children[1].innerHTML = `<div><img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62d14e0fd359cc7cd96e0e25_Like.svg" loading="lazy" alt=""/></div>`;
            liked_illustrations.splice(
              liked_illustrations.indexOf(wf_item_id),
              1
            );
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: liked_illustrations })
              .eq("user_id", auth.user.id);
          } else {
            $el
              .closest(".like-buttons-wrap")
              .get(
                0
              ).children[1].innerHTML = `<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_i_81_74)">
              <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" fill="#E62020"></path>
              </g>
              <defs>
              <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="2"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"></feBlend>
              </filter>
              </defs>
              </svg></div>`;

            liked_illustrations.push(wf_item_id);
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: liked_illustrations })
              .eq("user_id", auth.user.id);
          }
        } else {
          $el
            .closest(".like-buttons-wrap")
            .get(
              0
            ).children[1].innerHTML = `<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_i_81_74)">
            <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" fill="#E62020"></path>
            </g>
            <defs>
            <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset></feOffset>
            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"></feBlend>
            </filter>
            </defs>
            </svg></div>`;
          favourites.push(wf_item_id);

          const { data, error } = await supabase
            .from("user_profile")
            .update({ liked_illustrations: favourites })
            .eq("user_id", auth.user.id);

        }
      }
      else {
        const signinpopup = document.querySelector('.signup-popup');
        signinpopup.style.display = "flex"
      }
    }
  }
  useEffect(() => {
    if (typeof window != "updefined") {
      const hide = document.querySelector('.signup-popup');
      hide.addEventListener('click', hidefn);
      function hidefn() {
        hide.style.display = "none";
      }


      // const all = document.querySelectorAll('.filter-all-button');
      // all.forEach((e, i) => {
      //   if (i == 0) {
      //     e.click();
      //     console.log('dheeraj', e)
      //     // e.click()
      //   }
      // })


    }
  }, [])

  useEffect(() => {

    router.push("/")

  }, [router.asPath]);

  useEffect(() => {
    document.getElementById('all-home').classList.add('active-all-black')
    $('.filter-all-button').click(function () {
      document.getElementById('all-home').classList.remove('active-all-black')
    })
  }, [router])


  // if(!supabase.auth.session()){
  //   document.querySelectorAll('.like-buttons-wrap').forEach((ele)=>{
  //     ele.querySelector('.')
  //   })

  // }
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
