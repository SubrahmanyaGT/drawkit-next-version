import { useRouter } from "next/router";
import Head from "next/head";
import parseHtml, { domToReact } from "html-react-parser";
import get from "lodash/get";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { supabase } from "../utils/supabaseClient";
import { replace } from "../utils/replace-node";
import NavbarContent from "./navbar";

function unixDateToLocalDate(unxStamp) {
  return new Date(unxStamp * 1000).toLocaleDateString();
}
export default function Illustration(props) {
  const parseOptions = { replace };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savefName, setsavefName] = useState("");
  const [savelName, setsavelName] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [favraties, setFavraties] = useState([]);
  const [auth, setAuth] = useState(supabase.auth.session());
  const router = useRouter();
  const [nameChecker, setNameCheckr] = useState(null)

  function cancel() {
    if (supabase.auth.session()) {
      let uid = supabase.auth.session().user.id;

      supabase
        .from("stripe_users")
        .select("stripe_user_id")
        .eq("user_id", uid)
        .then(async ({ data, error }) => {
          //console.log(data[0].stripe_user_id);
          if (data.length > 0) {
            fetch("api/cancel-subscriptions", {
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
                if (!data.error) {
                  //console.log(data);
                  alert("successfully cancelled your subscription");
                } else {
                  alert("You have no active subscriptions");
                }
              });
          }
        });
    }
  }
  useEffect(() => {
    // if (supabase.auth.session() != null) {
    //   supabase
    //     .from("user_profile")
    //     .select()
    //     .eq("user_id", supabase.auth.session().user.id)
    //     .then(({ data, error }) => {
    //       if (data.length > 0) {
    //         setFirstName(data[0].first_name);
    //         setLastName(data[0].last_name);
    //         setsavefName(data[0].first_name);
    //         setsavelName(data[0].last_name);
    //       }
    //     });
    // }

    if (supabase.auth.session() != null) {
      let uid = supabase.auth.session().user.id;

      supabase
        .from("stripe_users")
        .select("stripe_user_id")
        .eq("user_id", uid)
        .then(async ({ data, error }) => {
          //console.log(data);
          if (data.length > 0) {
            fetch("/api/payment-intents", {
              method: "POST",
              headers: {
                contentType: "application/json",
              },
              body: JSON.stringify({ customer: data[0].stripe_user_id }),
            })
              .then((response) => response.json())
              .then((data) => {
                setPaymentDetails(data);
              });
          }
        });
    }

    if (supabase.auth.session() != null) {
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


  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {


      if (favraties.length > 0) {
        (async () => {
          let favcardCantainer = "";
          let { data, error } = await supabase
            .from("illustrations_pack")
            .select("*")
            .in("wf_item_id", favraties);
          if (!error) {
            console.log("packs", data);
            data.forEach((pack) => {
              favcardCantainer += `
              <div class="favourite-details">
              <a href="/product/${pack.wf_slug}" class="favourite-flex w-inline-block">
                  <div class="pack_id">${pack.wf_item_id}</div>
                  <div class="favourite-image-wrapper">
                      <img src="${pack.thumbnail_img}" loading="lazy" alt="" class="favourites-image">
                  </div>
                  <div class="liked-content">
                      <div class="favourite-title text-style-1lines ">${pack.name}
                      </div>
                  </div>
              </a>
      
              <div class="cancel-favourite-wrapper">
                  <div class="cancel-favourite-icon">
                      <img src="https://assets.website-files.com/626f5d0ae6c15c780f2dd5c4/626f5d0ae6c15c51462dd655_wrong.svg"
                          loading="lazy" alt="donts">
                  </div>
              </div>
          </div>
              `;
            });
            document.querySelector(".favourite-content-wrapper").innerHTML =
              favcardCantainer;
          }
        })();
      } else {
        document.querySelector(".favourite-content-wrapper").innerHTML = `
        <div class="w-layout-grid favourites-grid-profile"><div id="w-node-_1f6cf04d-131e-d345-fba9-91e37f091557-94a70818" class="no-favourite-text">No Illustrations has been Liked Yet...</div></div>
        `
      }
    }


    // console.log(favraties, "favraties");
  }, [favraties]);
  useEffect(() => {
    // console.log("paymentDetails",paymentDetails.paymentIntents);
    if (typeof window !== "undefined" && paymentDetails) {
      let parentDiv = document.getElementById("invoice-detail");
      let innerText = "";
      paymentDetails.paymentIntents.data.forEach((payment) => {
        let invoice = paymentDetails.invoices.data.find(
          (el) => el.payment_intent == payment.id
        );
        innerText += `<div class="subscription-invoice-details"><div class="bill-date">${(payment.amount_received / 100).toFixed(2) +
          " " +
          payment.currency.toUpperCase()
          }</div> 
        <div class="bill-date">${unixDateToLocalDate(
            invoice.lines.data[0].period.start
          )}</div>
        <div class="bill-date">${unixDateToLocalDate(
            invoice.lines.data[0].period.end
          )}</div>
        <div class="bill-date"><a href="${invoice.hosted_invoice_url
          }" target='_blank'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download" style="&#10;    color: black;&#10;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></a></div></div>
        `;
        //console.log(paymentDetails.invoices);
        //console.log(
        //(payment.amount_received / 100).toFixed(2) +
        //" " +
        // payment.currency.toUpperCase()
        //);
        //console.log(unixDateToLocalDate(payment.created));

        //console.log(invoice.hosted_invoice_url);
        //console.log(unixDateToLocalDate(invoice.lines.data[0].period.end));
        //console.log(unixDateToLocalDate(invoice.lines.data[0].period.start));
      });
      parentDiv.innerHTML = innerText;
    }
  }, [paymentDetails]);

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
            setFirstName(data.data[0].first_name);
            setLastName(data.data[0].last_name);
            setsavefName(data.data[0].first_name);
            setsavelName(data.data[0].last_name);
          } else {
            console.log('no data')
          }
        });

      document.getElementById("first-name").value = firstName;
      document.getElementById("last-name").value = lastName;
      if (nameChecker != null) {
        document.querySelector(".user-name").innerText = nameChecker;
        // username-letters
        document.querySelector('.letter-avatar').innerText = nameChecker.slice(0, 1)
        document.querySelector('.username-letters-small').innerText = nameChecker.slice(0, 1)

      } else {
        document.querySelector(".user-name").innerText = auth.user.email.split("@")[0];
        document.querySelector('.letter-avatar').innerText = auth.user.email.split("")[0]
        document.querySelector('.username-letters-small').innerText = auth.user.email.split("")[0]
      }

    }
  }, [savefName, nameChecker, savelName]);
  //console.log(firstName, lastName);
  async function wrapClickHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#save-changes").get(0)) {
      if (document.querySelector('#first-name').value == "") {
        alert("Please enter your first and last name");
      } else if (document.querySelector('#last-name').value == "") {
        alert("Please enter your last name");
      } else {

        if (
          !!firstName &&
          !!lastName &&
          (firstName != savefName || lastName != savelName)
        ) {
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
                setsavefName(firstName);
                setsavelName(lastName);
              }
            });
        }
      }
      //Before update firstname 
      // if (
      //   !!firstName &&
      //   !!lastName &&
      //   (firstName != savefName || lastName != savelName)
      // ) {
      //   supabase
      //     .from("user_profile")
      //     .upsert(
      //       {
      //         first_name: firstName,
      //         last_name: lastName,
      //         user_id: supabase.auth.session().user.id,
      //       },
      //       { onConflict: "user_id" }
      //     )
      //     .then(({ data, error }) => {
      //       if (error) {
      //         alert(error.message);
      //       } else {
      //         setsavefName(firstName);
      //         setsavelName(lastName);
      //         alert("Changes has been successfully updated");
      //       }
      //     });
      // }
    }

    if (!!$el.closest(".subscription-plan-button").get(0)) {
      $("#popup-open").addClass("popup-open");
    }

    if ($el.get(0).id == "cancel-popup") {
      $("#popup-open").removeClass("popup-open");
    }

    if (!!$el.closest("#cancel-yes").get(0)) {
      cancel();
      $("#popup-open").removeClass("popup-open");
    }
    if (!!$el.closest("#cancel-no").get(0)) {
      $("#popup-open").removeClass("popup-open");
    }
  }

  async function wrapChangeHandler(event) {
    var $el = $(event.target);

    if (!!$el.closest("#first-name").get(0)) {
      setFirstName($el.closest("#first-name").val());
      //console.log(firstName);
    }
    if (!!$el.closest("#last-name").get(0)) {
      setLastName($el.closest("#last-name").val());
      //console.log(lastName);
    }
  }

  if (auth) {

    const closeButtons = document.querySelectorAll('.cancel-favourite-wrapper');
    const favourite_details = document.querySelectorAll('.favourite-details');
    //console.log('closeButtons', closeButtons)
    closeButtons.forEach((ele, index1) => {
      // console.log('ele', ele)
      ele.addEventListener('click', (e) => {
        favourite_details.forEach((ele, index2) => {
          if (index2 == index1) {
            let liked_illustrations = favraties;
            const wf_item_id = ele.children[0].children[0].innerText;
            //console.log(wf_item_id);
            liked_illustrations.splice(
              liked_illustrations.indexOf(wf_item_id),
              1
            );
            supabase
              .from("user_profile")
              .update({ liked_illustrations: liked_illustrations })
              .eq("user_id", auth.user.id).then(() => {
                ele.style.display = "none"
                //console.log("pack Dxelete Successfully")
              })
          }
        })
      })
    })
  }

  return supabase.auth.session() != null ? (
    <>
      <div onClick={wrapClickHandler} onChange={wrapChangeHandler}>
        {parseHtml(props.bodyContent, parseOptions)}
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></Script>
      </div>
      <div>
        {
          // paymentDetails.map((payments)=>{
          //   console.log(paymentDetails)
          //   return (<>
          //   {/* <div>{payments.amount_received}</div>
          //   <div>{payments.description}</div>
          //   <div>{payments.email}</div>
          //   <div>{new Date(payments.created*1000).toDateString("en-US")}</div>
          //   <div><a href={payments.receipt_url} download>{payments.receipt_url}</a></div> */}
          //   </>)
          // })
        }
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
    const navBar = $(`.nav-access`).html();
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