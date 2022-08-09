import get from "lodash/get";
import Link from "next/link";
import Script from "next/script";
import parseHtml, { domToReact } from "html-react-parser";
import { supabase } from "../utils/supabaseClient";

let premiumUser = "inactive";
let pcheck = () => {
  if (supabase.auth.session()) {
    let uid = supabase.auth.session().user.id;
    supabase
      .from("stripe_users")
      .select("stripe_user_id")
      .eq("user_id", uid)
      .then(({ data, error }) => {
        fetch("api/check-active-status", {
          method: "POST",
          headers: {
            contentType: "application/json",
          },
          body: JSON.stringify({ customer: data[0].stripe_user_id }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            premiumUser = data.status;
          });
      });
  }
};

// console.log(premiumUser, supabase.auth.session());
// pcheck()
function isUrlInternal(link) {
  if (
    !link ||
    link.indexOf(`https:`) === 0 ||
    link.indexOf(`#`) === 0 ||
    link.indexOf(`http`) === 0 ||
    link.indexOf(`://`) === 0
  ) {
    return false;
  }
  return true;
}

export function replace(node) {
  const attribs = node.attribs || {};
  if (attribs.hasOwnProperty("class")) {
    // console.log();
    attribs["className"] = attribs["class"].split(" ").filter(v => !v.match('w-form')).join(" ");
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
              <form
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
              </form>
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
      if (props.className.includes("contact-page-form")) {
        return (
          <div
            {...props}
            dangerouslySetInnerHTML={{
              __html: `<form
              id="wf-form-contact-form"
              name="wf-form-contact-form"
              data-name="contact-form"
              method="get"
              class="input-form"
              aria-label="contact-form"
            >
              <div
                data-delay="0"
                data-hover="false"
                fs-selectcustom-element="dropdown"
                class="dropdown w-dropdown"
                style=""
              >
                <div
                  class="field select w-dropdown-toggle"
                  id="w-dropdown-toggle-4"
                  aria-controls="w-dropdown-list-4"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                  role="button"
                  tabindex="0"
                >
                  <img
                    loading="eager"
                    src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c9ff42dd664_info-S.svg"
                    alt="Question icon
              "
                    class="icons-contact-form"
                  />
                  <div class="text-size-regular text-color-black break">
                    Please choose your Reason for contact
                  </div>
                  <div class="w-icon-dropdown-toggle" aria-hidden="true"></div>
                </div>
                <nav
                  class="dropdown-list w-dropdown-list"
                  id="w-dropdown-list-4"
                  aria-labelledby="w-dropdown-toggle-4"
                  role="listbox"
                  aria-multiselectable="false"
                >
                  <select
                    id="field-2"
                    name="field-2"
                    data-name="Field 2"
                    required=""
                    class="select-options hide w-select"
                  >
                    <option value="">Please choose your Reason for contact</option>
                    <option value="First">First choice</option>
                    <option value="Second">Second choice</option>
                    <option value="Third">Third choice</option></select
                  ><a
                    href="#"
                    class="select-option-link text-size-regular w-dropdown-link w--current"
                    tabindex="0"
                    role="option"
                    aria-selected="true"
                    >Please choose your Reason for contact</a
                  ><a
                    href="#"
                    class="select-option-link text-size-regular w-dropdown-link"
                    tabindex="-1"
                    role="option"
                    aria-selected="false"
                    >First choice</a
                  ><a
                    href="#"
                    class="select-option-link text-size-regular w-dropdown-link"
                    tabindex="-1"
                    role="option"
                    aria-selected="false"
                    >Second choice</a
                  ><a
                    href="#"
                    class="select-option-link text-size-regular w-dropdown-link"
                    tabindex="-1"
                    role="option"
                    aria-selected="false"
                    >Third choice</a
                  >
                </nav>
              </div>
              <div class="field">
                <img
                  loading="eager"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c07172dd663_Profile.svg"
                  alt="profile"
                  class="icons-contact-form"
                /><input
                  type="text"
                  class="form-input-field w-input"
                  maxlength="256"
                  name="Name"
                  data-name="Name"
                  placeholder="Enter your full name"
                  id="Name-5"
                  required=""
                />
              </div>
              <div class="field">
                <img
                  loading="eager"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c74572dd666_Email.svg"
                  alt="Email"
                  class="icons-contact-form"
                /><input
                  type="email"
                  class="form-input-field w-input"
                  maxlength="256"
                  name="Email"
                  data-name="Email"
                  placeholder="Email"
                  id="Email-5"
                  required=""
                />
              </div>
              <div class="field full-message">
                <img
                  loading="eager"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c67cd2dd665_Message.svg"
                  alt="Message icon"
                  class="icons-contact-form"
                /><textarea
                  id="field"
                  name="field"
                  maxlength="5000"
                  data-name="field"
                  placeholder="Enter your full message"
                  required=""
                  class="form-input-field textarea w-input"
                ></textarea>
              </div>
              <div class="recaptcha-sent-wrap">
                <div>
                  <div class="text-size-tiny text-color-grey">
                    Please tick the box to continue
                  </div>
                  <div
                    data-sitekey="6LcU1DogAAAAAGmn7QwLkyipWNQDOftM-QpwdEtG"
                    class="w-form-formrecaptcha recaptcha g-recaptcha g-recaptcha-error g-recaptcha-disabled"
                  ></div>
                </div>
                <div class="button-wrap">
                  <div class="btn-primary">
                    <input
                      type="submit"
                      value="Sent"
                      data-wait="Please wait..."
                      class="submit-button w-button"
                    />
                    <div>Sent</div>
                    <img
                      loading="lazy"
                      src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c2bb32dd5f5_Arrows.svg"
                      alt=""
                      class="button-icon"
                    />
                  </div>
                  <div class="btn-overlay"></div>
                </div>
              </div>
            </form>`,
            }}
          ></div>
        );
      }
      if (props.className.includes("signin-page-form")) {
        return (
          <div
            {...props}
            dangerouslySetInnerHTML={{
              __html: `<div class="">
          <form
            id="signin-form"
            name="email-form"
            data-name="Email Form"
            method="get"
            class="input-form"
            aria-label="Email Form"
          >
            <div class="field signup">
              <img
                loading="lazy"
                src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c74572dd666_Email.svg"
                alt="Email"
              /><input
                type="text"
                class="form-input-field w-input"
                maxlength="256"
                name="name"
                data-name="Name"
                placeholder="Email"
                id="d-signin-email"
                required=""
              />
            </div>
            <div>
              <div class="field signup">
                <img
                  loading="lazy"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed0ac96440104be2d0d_Lock.svg"
                  alt="Password"
                /><input
                  type="password"
                  class="form-input-field w-input"
                  maxlength="256"
                  name="Password"
                  data-name="Password"
                  placeholder="Password"
                  id="d-signin-pass"
                  required=""
                /><img
                  loading="lazy"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed075f2ff3e4945af86_View.svg"
                  alt="view Password"
                  class="reveal-pw"
                /><img
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/629e33ac7bb28319dc7cc9a8_eye-close.png"
                  loading="eager"
                  alt="hide password
              "
                  class="hide-pw"
                />
              </div>
              <div class="validator-message"></div>
              <div class="forgot-pw text-color-grey">
                Forgot password?
                <a href="/password-reset" class="text-color-black hover-pink"
                  >Reset Password</a
                >
              </div>
            </div>
            <div id="signinloaderWrapper" class="button-wrap" >
             <div id="signin" class="button-wrap signin">
              <div class="btn-primary"><div>Sign In</div></div>
              <div class="btn-overlay"></div>
             </div>
            </div>
            <div class="have-account text-color-grey">
              Don't have any account?
              <a href="/signup" class="text-color-black hover-pink">Sign Up</a>
            </div>
          </form>
        </div>`,
            }}
          ></div>
        );
      }
      if (props.className.includes("signup-page-form")) {
        return (
          <div
            {...props}
            dangerouslySetInnerHTML={{
              __html: `<div class="">
          <form
            id="signup-form"
            name="email-form"
            data-name="Email Form"
            method="get"
            class="input-form"
            aria-label="Email Form"
          >
            <div class="field signup" style="border: 1px solid rgb(204, 209, 214)">
              <img
                loading="lazy"
                src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c74572dd666_Email.svg"
                alt="Email"
              /><input
                type="email"
                class="form-input-field w-input"
                maxlength="256"
                name="field-2"
                data-name="Field 2"
                placeholder="Email"
                id="signup-name"
                required=""
              />
            </div>
            <div>
              <div class="field signup">
                <img
                  loading="lazy"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed0ac96440104be2d0d_Lock.svg"
                  alt="Password"
                /><input
                  type="password"
                  class="form-input-field w-input"
                  maxlength="256"
                  name="Password"
                  data-name="Password"
                  placeholder="Password"
                  id="d-signup-pass"
                /><img
                  loading="lazy"
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed075f2ff3e4945af86_View.svg"
                  alt="view Password"
                  class="reveal-pw"
                /><img
                  src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/629e33ac7bb28319dc7cc9a8_eye-close.png"
                  loading="eager"
                  alt="hide password
            "
                  class="hide-pw"
                />
              </div>
              <div class="validator-message"></div>
              <label class="w-checkbox agree-tc text-color-grey"
                ><div
                  class="w-checkbox-input w-checkbox-input--inputType-custom checkbox"
                ></div>
                <input
                  type="checkbox"
                  name="checkbox"
                  id="d-signup-checkbox"
                  data-name="Checkbox"
                  required=""
                  style="opacity: 0; position: absolute; z-index: -1"
                /><span class="w-form-label" for="checkbox"
                  >Agreed with our
                  <a href="/terms-of-service" class="text-color-black hover-pink"
                    >Terms of Services</a
                  >
                  and
                  <a href="/privacy-policy" class="text-color-black hover-pink"
                    >Privacy Policy.</a
                  ></span
                ></label
              >
            </div>
            <div id="loaderWrapper" class="button-wrap" >
              <div id="signup" class="button-wrap signup">
                <div class="btn-primary">
                <div>Sign Up</div>
                </div>
                <div class="btn-overlay"></div>
              </div>
            </div>
            <div class="have-account text-color-grey">
              Already a member?
              <a href="/signin" class="text-color-black hover-pink">Sign In</a>
            </div>
          </form>
        </div>`,
            }}
          ></div>
        );
      }

      // confirm Password form 
      // if (props.className.includes("change-pwd-form")) {
      //   return (
      //     <div
      //       {...props}
      //       dangerouslySetInnerHTML={{
      //         __html: `
      //         <form id="email-form" name="email-form" data-name="Email Form" method="get" class="input-form" aria-label="Email Form">
      //                   <div class="field signup">
      //                       <img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed0ac96440104be2d0d_Lock.svg" alt="Password">
      //                       <input type="password" class="form-input-field w-input" maxlength="256" name="new-password" data-name="new-password" placeholder="Enter a new Password" id="new-password" required="">
      //                       <img id="new-pwd-revel" loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed075f2ff3e4945af86_View.svg" alt="view Password" class="reveal-pw">
      //                       <img id="hide-pwd-revel" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/629e33ac7bb28319dc7cc9a8_eye-close.png" loading="eager" alt="hide password" class="hide-pw">
      //                   </div>
      //                   <div class="field signup">
      //                     <img loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed0ac96440104be2d0d_Lock.svg" alt="Password">
      //                     <input type="password" class="form-input-field w-input" maxlength="256" name="confirm-password" data-name="confirm-password" placeholder="Confirm Password" id="confirm-password" required="">
      //                     <img id="revel-pwd-confirm" loading="lazy" src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/628b4ed075f2ff3e4945af86_View.svg" alt="view Password" class="reveal-pw">
      //                     <img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/629e33ac7bb28319dc7cc9a8_eye-close.png" loading="eager" id="confirm-pwd-hide" alt="hide password" class="hide-pw">
      //                  </div>
      //                  <div class="validator-message reset"></div>
      //               <div id="reset" class="button-wrap signup">
      //                   <div class="btn-primary">
      //                   <div>Submit</div>
      //                   </div>
      //                <div class="btn-overlay">

      //               </div>
      //             </div>

      //        </form>

      //         `,
      //       }}
      //     ></div>
      //   );
      // }
      if (props.className.includes("username-letters-big")) {
        if (supabase.auth.session()) {
          return (
            <div className="username-letters-big big">
              {supabase.auth.session().user.email.slice(0, 1).toUpperCase()}
            </div>
          );
        }
      }
      if (props.className.includes("username-letters-small")) {
        if (supabase.auth.session()) {
          return (
            <div className="username-letters-small small">
              {supabase.auth.session().user.email.slice(0, 1).toUpperCase()}
            </div>
          );
        }
      }
      if (props.className.match(/^user$/)) {
        if (supabase.auth.session()) {
          return (
            <div className="user">
              {supabase.auth
                .session()
                .user.email.slice(
                  0,
                  supabase.auth.session().user.email.indexOf("@")
                )}
            </div>
          );
        }
      }
      if (props.className.includes("registered-email")) {
        if (supabase.auth.session()) {
          return (
            <div className="registered-email">
              {supabase.auth.session().user.email}
            </div>
          );
        }
      }

      // if (props.className.includes("free-plan")) {
      //   if (supabase.auth.session() && premiumUser != "active")
      //     return <div className="free-plan">Current</div>;
      //   else {
      //     return <div></div>;
      //   }
      // }

      // if (props.className.includes("premium-plan")) {
      //   if (premiumUser == "active") {
      //     return <div className="premium-plan">Current</div>;
      //   } else {
      //     return <div></div>;
      //   }
      // }
      if (props.className.includes("navbar-button-wrap")) {
        if (supabase.auth.session()) {
          // console.log(supabase.auth.session(), "supabase.auth.session()");
          return (
            <div className="user-profile" id="user-name">
              <div className="user-name-wrap">
                <div className="letter-avatar">
                  {supabase.auth.session().user.email.slice(0, 1)}
                </div>
                <div className="user-name">
                  {supabase.auth
                    .session()
                    .user.email.slice(
                      0,
                      supabase.auth.session().user.email.indexOf("@")
                    )}
                </div>
              </div>
              <div className="my-profile-wrap">
                <div className="my-profile-options">
                  <div
                    id="account"
                    // href="/profile"
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
      // if (props.className.includes("navwrapper")) {
      //   if (supabase.auth.session()) {
      //     return <div></div>
      //   }
      // }
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

const parseOptions = { replace };
