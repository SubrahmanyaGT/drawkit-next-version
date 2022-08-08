import "../styles/globals.css";
// import App from 'next/app'
import NavbarContent from "./navbar";
// import { replace } from "../utils/replace-node";
import parseHtml, { domToReact } from "html-react-parser";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LogRocket from "logrocket";
import { UserProvider } from "../lib/authInfo";
import { supabase } from "../utils/supabaseClient";
import InitUser from "./authComponent";
import get from "lodash/get";
import Link from "next/link";

LogRocket.init("p5qzuw/drawkit-test");

function MyApp(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { Component, pageProps } = props;
  const [auth, setAuth] = useState(supabase.auth.session());
  let [favourites, setFavraties] = useState([]);
  const [savefName, setsavefName] = useState("");
  const [savelName, setsavelName] = useState("");
  const [nameChecker, setNameCheckr] = useState(null)

  useEffect(() => {
    if (supabase.auth.session() != null) {
      supabase
        .from("user_profile")
        .select()
        .eq("user_id", supabase.auth.session().user.id)
        .then((data) => {
          setNameCheckr(data.data[0].first_name)
          if (data.data.first_name != null) {
            console.log('Test', data)
            setsavefName(data.data[0].first_name);
            setsavelName(data.data[0].last_name);
          } else {
            console.log('no data')
          }
        });

      // if (savefName != "") {
      //   document.querySelector(".user-name").innerText = savefName;
      //   document.querySelector('.letter-avatar').innerText = savefName.slice(0, 1)
      // } else {
      //   document.querySelector(".user-name").innerText = auth.user.email.split("@")[0];
      //   document.querySelector('.letter-avatar').innerText = auth.user.email.split("")[0]
      // }

    }
  }, [savefName, nameChecker, savelName, router]);




  supabase.auth.onAuthStateChange((event, session) => {
    setAuth(supabase.auth.session());
  });
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
        if (props.className.includes("nav-form")) {
          return (
            <div {...props}>
              <div className="form-block ">
                <div
                  id="wf-form-search"
                  name="wf-form-search"
                  data-name="search"
                  method="post"
                  className="search-wrapper"
                  aria-label="search"
                >
                  <img
                    loading="lazy"
                    src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c4a0b2dd61b_Search.svg"
                    alt="Search"
                    className="search-icon"
                  />
                  <input
                    type="text"
                    className="search-input w-input"
                    maxLength="256"
                    name="search"
                    data-name="search"
                    placeholder="Categories, types, subjects, etc"
                    id="nav-search-input"
                    required=""
                  />
                  <div id="close" className="search-cancel-wrapper nav">
                    <div id="search-close" className="cancel-icon w-embed">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.336 20.0962C17.6339 19.6019 16.9608 19.0677 16.32 18.4962C15.664 17.9522 15.056 17.3282 14.432 16.7522C13.808 16.1762 13.232 15.5042 12.656 14.8802C12.0814 14.2197 11.547 13.5251 11.056 12.8002C10.8698 12.5257 10.7991 12.1889 10.8589 11.8627C10.9188 11.5364 11.1045 11.2468 11.376 11.0562C11.585 10.9186 11.8298 10.8452 12.08 10.8452C12.3303 10.8452 12.575 10.9186 12.784 11.0562C13.4885 11.5541 14.1667 12.0882 14.816 12.6562C15.456 13.2322 16.08 13.8242 16.688 14.4322C17.264 15.0562 17.888 15.6482 18.448 16.3042C19.016 16.9535 19.5501 17.6317 20.048 18.3362C20.1434 18.4683 20.2117 18.6179 20.2489 18.7766C20.2861 18.9352 20.2915 19.0996 20.2647 19.2603C20.2379 19.421 20.1795 19.5748 20.0929 19.7128C20.0062 19.8508 19.8931 19.9702 19.76 20.0642C19.5525 20.21 19.3064 20.2909 19.0529 20.2966C18.7993 20.3023 18.5498 20.2325 18.336 20.0962Z"
                          fill="currentcolor"
                        ></path>
                        <path
                          d="M11.056 11.2002C11.552 10.4962 12.112 9.84022 12.656 9.18422C13.2 8.52822 13.856 8.00022 14.4 7.28022C14.944 6.56022 15.632 6.09622 16.272 5.52022C16.9213 4.9522 17.5995 4.41815 18.304 3.92022C18.5439 3.76289 18.8307 3.69302 19.1161 3.72237C19.4015 3.75172 19.668 3.87849 19.8709 4.08135C20.0737 4.28421 20.2005 4.55077 20.2299 4.83616C20.2592 5.12154 20.1893 5.40832 20.032 5.64822C19.5423 6.35879 19.0079 7.0375 18.432 7.68022C17.84 8.32022 17.264 8.94422 16.656 9.55222C16.048 10.1602 15.424 10.7522 14.768 11.3122C14.112 11.8722 13.456 12.4322 12.752 12.9122C12.4819 13.0991 12.1491 13.172 11.8256 13.1151C11.5021 13.0582 11.2141 12.8761 11.024 12.6082C10.8848 12.3984 10.8133 12.1509 10.819 11.8992C10.8247 11.6475 10.9074 11.4035 11.056 11.2002Z"
                          fill="currentcolor"
                        ></path>
                        <path
                          d="M5.66399 3.90412C6.3661 4.39837 7.03921 4.93259 7.67999 5.50412C8.33599 6.04812 8.94399 6.67212 9.56799 7.24812C10.192 7.82412 10.768 8.49612 11.344 9.12012C11.9187 9.78065 12.453 10.4752 12.944 11.2001C13.1302 11.4747 13.2009 11.8114 13.1411 12.1376C13.0812 12.4639 12.8955 12.7536 12.624 12.9441C12.415 13.0818 12.1702 13.1551 11.92 13.1551C11.6697 13.1551 11.425 13.0818 11.216 12.9441C10.5115 12.4462 9.83327 11.9121 9.18399 11.3441C8.54399 10.7468 7.91999 10.1654 7.31199 9.60012C6.73599 8.97612 6.11199 8.38412 5.55199 7.72812C4.98396 7.07883 4.44992 6.40059 3.95199 5.69612C3.85656 5.56406 3.78828 5.41439 3.75109 5.25576C3.7139 5.09714 3.70854 4.93272 3.73533 4.77201C3.76211 4.6113 3.82051 4.4575 3.90713 4.31951C3.99376 4.18152 4.10689 4.06209 4.23999 3.96812C4.44426 3.81747 4.6887 3.73095 4.94225 3.71955C5.19581 3.70816 5.44703 3.7724 5.66399 3.90412Z"
                          fill="currentcolor"
                        ></path>
                        <path
                          d="M12.944 12.7999C12.448 13.5039 11.888 14.1599 11.344 14.8159C10.8 15.4719 10.16 16.0639 9.58399 16.7039C9.00799 17.3439 8.35199 17.8879 7.71199 18.4639C7.06271 19.0319 6.38447 19.566 5.67999 20.0639C5.44009 20.2212 5.15331 20.2911 4.86793 20.2617C4.58254 20.2324 4.31598 20.1056 4.11312 19.9028C3.91026 19.6999 3.78349 19.4333 3.75414 19.148C3.72479 18.8626 3.79466 18.5758 3.95199 18.3359C4.4417 17.6253 4.97612 16.9466 5.55199 16.3039C6.14399 15.6639 6.71999 15.0399 7.32799 14.4319C7.93599 13.8239 8.55999 13.2319 9.21599 12.6719C9.87199 12.1119 10.528 11.5519 11.232 11.0719C11.5021 10.885 11.8349 10.8121 12.1584 10.869C12.4819 10.9259 12.7699 11.108 12.96 11.3759C13.1051 11.5857 13.1814 11.8354 13.1786 12.0904C13.1757 12.3455 13.0938 12.5934 12.944 12.7999Z"
                          fill="currentcolor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div id="search" className="search-button nav-search">
                    <div className="search-text">Search</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
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
        if (props.className.includes("contact-form-footer")) {
          return (
            <div
              {...props}
              dangerouslySetInnerHTML={{
                __html: `<form
                  id="wf-form-Footer-form"
                  name="wf-form-Footer-form"
                  data-name="Footer-form"
                  method="get"
                  class="contact-form responsive-grid"
                  aria-label="Footer-form"
                >
                  <div
                    id="w-node-_3b06e6de-9487-5803-52ff-9665a1338a9a-a1338a8f"
                    class="input-field"
                  >
                    <img
                      loading="lazy"
                      src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c07172dd663_Profile.svg"
                      alt="profile"
                      class="user-icon"
                    /><input
                      type="text"
                      class="text-field text-size-regular w-input"
                      maxlength="256"
                      name="Name"
                      data-name="Name"
                      placeholder="Your full name"
                      id="Name-4"
                      required=""
                    />
                  </div>
                  <div class="input-field">
                    <img
                      loading="lazy"
                      src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c74572dd666_Email.svg"
                      alt="Email"
                      class="user-icon email"
                    /><input
                      type="email"
                      class="text-field text-size-regular w-input"
                      maxlength="256"
                      name="Email"
                      data-name="Email"
                      placeholder="Your email"
                      id="Email-3"
                      required=""
                    />
                  </div>
                  <div class="button-wrap home-form">
                    <div class="btn-primary">
                      <div>Submit</div>
                      <input
                        type="submit"
                        value="Submit"
                        data-wait="Please wait..."
                        class="submit-button w-button"
                      /><img
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
        if (props.className.includes("search-form")) {
          return (
            <div
              {...props}
              dangerouslySetInnerHTML={{
                __html: ` <div
                 name="email-form-3"
                 data-name="Email Form 3"
                 id="search-form"
                 class="search-wrapper mobile-view"
               >
                 <img
                   loading="lazy"
                   src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c4a0b2dd61b_Search.svg"
                   alt="Search"
                   class="search-icon"
                 /><input
                   type="text"
                   maxlength="256"
                   name="name-3"
                   data-name="Name 3"
                   placeholder="Categories, types, subjects, etc"
                   id="nav-search-input-mbl-signout"
                   class="search-input mobile w-input"
                 />
                 <div id="search-close-mbl-signout" class="search-cancel-wrapper">
                   <div class="cancel-icon-mobile w-embed">
                     <svg
                       width="20"
                       height="20"
                       viewBox="0 0 20 20"
                       fill="none"
                       xmlns="http://www.w3.org/2000/svg"
                     >
                       <path
                         d="M15.2795 16.7466C14.6944 16.3348 14.1334 15.8896 13.5995 15.4133C13.0528 14.96 12.5461 14.44 12.0261 13.96C11.5061 13.48 11.0261 12.92 10.5461 12.4C10.0672 11.8495 9.62199 11.2707 9.21279 10.6666C9.05765 10.4378 8.99866 10.1573 9.04855 9.88537C9.09844 9.61348 9.2532 9.3721 9.47946 9.2133C9.65362 9.0986 9.85759 9.03748 10.0661 9.03748C10.2747 9.03748 10.4786 9.0986 10.6528 9.2133C11.2399 9.62824 11.8051 10.0733 12.3461 10.5466C12.8795 11.0266 13.3995 11.52 13.9061 12.0266C14.3861 12.5466 14.9061 13.04 15.3728 13.5866C15.8461 14.1277 16.2912 14.6929 16.7061 15.28C16.7856 15.39 16.8425 15.5147 16.8735 15.6469C16.9045 15.7791 16.909 15.9161 16.8867 16.0501C16.8644 16.184 16.8157 16.3121 16.7435 16.4271C16.6713 16.5421 16.577 16.6417 16.4661 16.72C16.2932 16.8415 16.0881 16.9089 15.8768 16.9136C15.6656 16.9184 15.4576 16.8602 15.2795 16.7466Z"
                         fill="currentcolor"
                       ></path>
                       <path
                         d="M9.21341 9.33331C9.62675 8.74665 10.0934 8.19998 10.5467 7.65331C11.0001 7.10665 11.5467 6.66665 12.0001 6.06665C12.4534 5.46665 13.0267 5.07998 13.5601 4.59998C14.1011 4.12663 14.6663 3.68159 15.2534 3.26665C15.4533 3.13554 15.6923 3.07731 15.9301 3.10177C16.168 3.12623 16.3901 3.23187 16.5591 3.40092C16.7282 3.56997 16.8338 3.79211 16.8583 4.02993C16.8827 4.26775 16.8245 4.50673 16.6934 4.70665C16.2853 5.29879 15.84 5.86438 15.3601 6.39998C14.8667 6.93332 14.3867 7.45331 13.8801 7.95998C13.3734 8.46665 12.8534 8.95998 12.3067 9.42665C11.7601 9.89331 11.2134 10.36 10.6267 10.76C10.4017 10.9157 10.1243 10.9765 9.85471 10.9291C9.58515 10.8816 9.34514 10.7299 9.18675 10.5066C9.07075 10.3318 9.01112 10.1256 9.01589 9.9158C9.02066 9.70601 9.08959 9.50273 9.21341 9.33331Z"
                         fill="currentcolor"
                       ></path>
                       <path
                         d="M4.72079 3.25339C5.30588 3.66527 5.86681 4.11045 6.40079 4.58672C6.94746 5.04006 7.45413 5.56006 7.97413 6.04006C8.49413 6.52006 8.97413 7.08006 9.45413 7.60006C9.93301 8.1505 10.3783 8.72933 10.7875 9.33339C10.9426 9.56217 11.0016 9.84277 10.9517 10.1147C10.9018 10.3865 10.747 10.6279 10.5208 10.7867C10.3466 10.9014 10.1427 10.9625 9.93413 10.9625C9.72559 10.9625 9.52162 10.9014 9.34746 10.7867C8.7604 10.3718 8.1952 9.92674 7.65413 9.45339C7.12079 8.95561 6.60079 8.47117 6.09413 8.00006C5.61413 7.48006 5.09413 6.98672 4.62746 6.44006C4.15411 5.89899 3.70907 5.33379 3.29413 4.74672C3.21461 4.63668 3.1577 4.51195 3.12671 4.37976C3.09572 4.24758 3.09126 4.11056 3.11358 3.97663C3.1359 3.84271 3.18456 3.71454 3.25675 3.59955C3.32894 3.48456 3.42321 3.38503 3.53413 3.30672C3.70435 3.18118 3.90805 3.10908 4.11935 3.09959C4.33065 3.09009 4.53999 3.14363 4.72079 3.25339Z"
                         fill="currentcolor"
                       ></path>
                       <path
                         d="M10.7867 10.6667C10.3734 11.2534 9.90672 11.8 9.45338 12.3467C9.00005 12.8934 8.46672 13.3867 7.98672 13.92C7.50672 14.4534 6.96005 14.9067 6.42672 15.3867C5.88565 15.86 5.32045 16.3051 4.73338 16.72C4.53346 16.8511 4.29448 16.9094 4.05666 16.8849C3.81884 16.8604 3.59671 16.7548 3.42766 16.5858C3.25861 16.4167 3.15296 16.1946 3.1285 15.9568C3.10405 15.7189 3.16227 15.4799 3.29338 15.28C3.70148 14.6879 4.14682 14.1223 4.62672 13.5867C5.12005 13.0534 5.60005 12.5334 6.10672 12.0267C6.61338 11.52 7.13338 11.0267 7.68005 10.56C8.22672 10.0934 8.77338 9.6267 9.36005 9.2267C9.58512 9.07094 9.86251 9.01018 10.1321 9.0576C10.4016 9.10503 10.6417 9.25681 10.8001 9.48003C10.921 9.65487 10.9846 9.86293 10.9822 10.0755C10.9798 10.288 10.9115 10.4946 10.7867 10.6667Z"
                         fill="currentcolor"
                       ></path>
                     </svg>
                   </div>
                 </div>
                 <div id="search-submit-signout" class="search-button nav-search">
                   <div>Search</div>
                 </div>
               </div>`,
              }}
            ></div>
          );
        }
        // state changes when the auth state changes  
        if (props.className.includes("navbar-button-wrap")) {
          if (auth != null) {
            return (
              <div className="user-profile" id="user-name">
                <div className="user-name-wrap">
                  <div className="letter-avatar">
                    {
                      (nameChecker != null) ?
                        nameChecker.slice(0, 1)
                        :
                        auth.user.email.split("")[0]

                    }
                  </div>
                  <div className="user-name">
                    {
                      (nameChecker != null) ?
                        nameChecker
                        :
                        auth.user.email.split("@")[0]
                    }
                  </div>
                </div>
                <div className="my-profile-wrap">
                  <div className="my-profile-options">
                    <div
                      id="account"
                      aria-current="page"
                      className="my-profile-links w-inline-block w--current"
                    >
                      <div id="account-link-text">My Account</div>
                      <img
                        src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62909c7c81a99984fbd1304b_Chevrons5.svg"
                        loading="lazy"
                        alt="chevron"
                        className="right-chevron"
                      />
                    </div>
                    <div id="d-nav-signout" className="my-profile-links">
                      <div>Logout</div>
                      <img
                        src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62909c7c81a99984fbd1304b_Chevrons5.svg"
                        loading="lazy"
                        alt="chevron"
                        className="right-chevron"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className="buttons-wrap"
                dangerouslySetInnerHTML={{
                  __html: ` <a id="d-nav-signin" href="/signin" class="sign-in-button w-inline-block"
          ><div>Sign In</div></a
        ><a id="d-nav-signup" href="/signup" class="button-wrap w-inline-block"
          ><div class="btn-primary nav-signup"><div>Sign Up</div></div>
          <div class="btn-overlay"></div
        ></a>`,
                }}
              ></div>
            );
          }
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
      if (!style && href) {
        if (
          href.includes("/illustration-types/") ||
          href.includes("/illustration-categories/") ||
          href.includes("/single-illustrations/") ||
          href.includes("/illustrations")
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

        if (props.className) {
          if (props.className.includes("upgrade-plan-link")) {
            // console.log(node.children[2].children[0].data);

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
                premiumUser != "active"
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
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: content }}
          ></Script>
        );
      } else {
        <Script
          {...attribs}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: content }}
        ></Script>;
      }
    }
    const { href, style, ...props } = attribs;
  }

  const parseOptions = {
    replace: replace,
  };


  useEffect(() => {

    // const w_dropdown = document.querySelector('.w-dropdown');
    // const detail_dropdown = document.querySelector('.w-dropdown-toggle');
    // const detail_dropdown_list = document.querySelector('.w-dropdown-list');



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
  }, [router]);

  useEffect(() => {
    console.log('checking useEffect');

    //heighlight the liked_illustrations
    let likeIcon = document.querySelectorAll(".like-buttons-wrap");
    likeIcon.forEach((icon) => {
      let wf_item_id = icon.children[0].innerText;
      console.log(wf_item_id)
      const like = icon.children[1];
      icon.addEventListener('click', (e) => {
        // console.log(e);
        if (auth) {

        } else {
          const signinpopup = document.querySelector('.signup-popup');
          signinpopup.style.display = "flex"
        }
      })
      // console.log(like)
      if (favourites.includes(wf_item_id)) {
        // console.log(wf_item_id, icon);
        icon.children[1].innerHTML = `<div><div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_i_81_74)">
        <path d="M20.7601 4.8802C23.0001 7.1202 23.0001 10.6402 20.7601 12.7202L19.9601 13.5202L13.5601 19.7602C12.6001 20.5602 11.1601 20.7202 10.3601 19.7602L3.9601 13.5202L3.1601 12.7202C1.0801 10.6402 1.0801 7.1202 3.1601 4.8802C5.4001 2.6402 8.9201 2.6402 11.1601 4.8802L11.9601 5.6802L12.7601 4.8802C15.0001 2.8002 18.5201 2.8002 20.7601 4.8802Z" fill="#E62020"/>
        </g>
        <defs>
        <filter id="filter0_i_81_74" x="1.6001" y="3.2002" width="20.8401" height="17.2212" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_81_74"/>
        </filter>
        </defs>
        </svg></div></div>`;
      } else {
        icon.children[1].innerHTML = `<div><img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62d14e0fd359cc7cd96e0e25_Like.svg" loading="lazy" alt=""/></div>`
      }

    });


  }, [favourites]);

  // const router = useRouter();
  useEffect(() => {

    // console.log(router);
    if (typeof Jetboost !== "undefined") {
      Jetboost = null;
    }

    if (typeof window !== "undefined") {
      window.JETBOOST_SITE_ID = "cl3t7gbuo00wi0n1548hwb3q8";

      (function (d) {
        var s = d.createElement("script");
        s.src = "https://cdn.jetboost.io/jetboost.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);

        d.getElementsByTagName("head")[0].removeChild(s);
      })(document);

      ((d) => {
        d.querySelectorAll(".nav-menu .w--open").forEach((el) => {
          el.classList.remove("w--open");
        });
        if (d.querySelectorAll(".nav-left-wrapper .w--open").length > 0) {
          document.querySelector('.menu-icon').click()
        }
      })(document);

    }


    if (location.href.split('/').includes('#')) {
      location.href = location.href.replace(/#/, "");
    }

  }, [router.pathname, router.query]);

  async function wrapClickHandler(event) {
    var $el = $(event.target);
    // document.querySelector('.signup-popup').style.display="none"
    if ($el.closest(".signup-popup").get(0)) {
      document.querySelector('.signup-popup').style.display = "none"
    }
    // detail-dropdown of pack hide and show

    // if ($el.closest(".detail-dropdown").get(0)) {
    //   console.log($el.closest(".detail-dropdown").get(0).innerHTML)
    //   // $el.closest(".detail-dropdown").get(0).toggleClass('.detail-dropdown')
    // }

    // working on like and dislike

    if ($el.closest(".like-buttons-wrap").get(0)) {
      let wf_item_id = $el.closest(".like-buttons-wrap").get(0)
        .children[0].innerText;
      //console.log(wf_item_id);
      if (auth) {

        if (favourites.length > 0) {

          if (
            favourites.length > 0 &&
            favourites.includes(wf_item_id)
          ) {
            $el
              .closest(".like-buttons-wrap")
              .get(
                0
              ).children[1].innerHTML = `<div><img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/62d14e0fd359cc7cd96e0e25_Like.svg" loading="lazy" alt=""/></div>`;
            favourites.splice(
              favourites.indexOf(wf_item_id),
              1
            );
            //console.log('favoirate', favourites)
            const { data, error } = await supabase
              .from("user_profile")
              .update({ liked_illustrations: favourites })
              .eq("user_id", auth.user.id);

            setFavraties((f) => {
              return [...f]
            });

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
            setFavraties((f) => {
              return [...f]
            });
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

          setFavraties((f) => {
            return [...f]
          });
        }

      }
      else {
        const signinpopup = document.querySelector('.signup-popup');
        signinpopup.style.display = "flex"
      }
    }

  }
  let navLayoutStyle = {};
  if (Component.getLayout) {
    navLayoutStyle = { display: "none" };
  }
  //console.log(props.stars.supportScripts);

  return (
    <>
      {" "}
      <Head>
        {parseHtml(props.stars.globalStyles, parseOptions)}
        {parseHtml(props.stars.headContent, parseOptions)}
      </Head>
      {/* <Script type="text/javascript" data-site-id='94e7f93cc3c0707dfc70' data-base-url src = 'https://customerioforms.com/assets/forms.js'></Script> */}
      <UserProvider>
        <InitUser setLoading={setLoading} auth={auth} />
        {loading ? (
          <div className="loadingContainer">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (

          <div onClick={wrapClickHandler}>

            {props.stars.supportScripts.map((m, i) => (
              <Script
                key={i}
                strategy="afterInteractive"
                type="text/javascript"
                src={m}
              ></Script>
            ))}
            <div style={navLayoutStyle}>
              <NavbarContent
                navbarContent={parseHtml(props.stars.navBar, parseOptions)}
              />
            </div>

            <Component {...pageProps} />
            <div style={navLayoutStyle}>
              {parseHtml(props.stars.footer, parseOptions)}
            </div>
            {parseHtml(props.stars.globalStyles, parseOptions)}


            <Script id="cookieyes" strategy="afterInteractive" src="https://cdn-cookieyes.com/client_data/31b4be05b2b0b55025b03191/script.js" />
            <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-S4VFVG86KB"></Script>
          </div>
        )}
      </UserProvider>
    </>
  );
}

MyApp.getInitialProps = async (ctx) => {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const webUrl = "https://drawkit-v2.webflow.io/new-test";
  const res = await axios(webUrl);
  const html = res.data;
  const $ = cheerio.load(html);

  const navBar = $(".nav-access").html();
  const globalStyles = $(".global-styles").html();
  const headContent = $(`head`).html();
  const footer = $(`.footer-access`).html();
  const supportScripts = Object.keys($(`body script`))
    .map((key) => {
      if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
    })
    .filter((src) => {
      if (src) return src;
    });
  // .map((m) => `<Script strategy="afterInteractive" type="text/javascript" src="${m}"></Script>`)
  //console.log("supportScripts", $(`body script`));
  return {
    stars: {
      headContent: headContent,
      globalStyles: globalStyles,
      supportScripts: supportScripts,
      navBar: navBar,
      footer: footer,
    },
  };
};
export default MyApp