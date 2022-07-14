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
  const router = useRouter();

  function cancel() {
    if (supabase.auth.session()) {
      let uid = supabase.auth.session().user.id;

      supabase
        .from("stripe_users")
        .select("stripe_user_id")
        .eq("user_id", uid)
        .then(async ({ data, error }) => {
          console.log(data);
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
                  console.log(data);
                  alert("successfully canceled your subscription");
                } else {
                  alert("You Have no active subscriptions");
                }
              });
          }
        });
    }
  }
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
            setsavefName(data[0].first_name);
            setsavelName(data[0].last_name);
          }
        });
    }

    if (supabase.auth.session() != null) {
      fetch("/api/payment-intents", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({ user_id: "" }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPaymentDetails(data);
        });
    }
  }, []);

  useEffect(() => {
    // console.log("paymentDetails",paymentDetails.paymentIntents);
    if (typeof window !== "undefined" && paymentDetails) {
      let parentDiv = document.getElementById("invoice-detail");
      let innerText = "";
      paymentDetails.paymentIntents.data.forEach((payment) => {
        let invoice = paymentDetails.invoices.data.find(
          (el) => el.payment_intent == payment.id
        );
        innerText += `<div class="subscription-invoice-details"><div class="bill-date">${
          (payment.amount_received / 100).toFixed(2) +
          " " +
          payment.currency.toUpperCase()
        }</div> 
        <div class="bill-date">${unixDateToLocalDate(
          invoice.lines.data[0].period.start
        )}</div>
        <div class="bill-date">${unixDateToLocalDate(
          invoice.lines.data[0].period.end
        )}</div>
        <div class="bill-date"><a href="${
          invoice.hosted_invoice_url
        }" target='_blank'>Recipt</a></div></div>
        `;
        console.log(paymentDetails.invoices);
        console.log(
          (payment.amount_received / 100).toFixed(2) +
            " " +
            payment.currency.toUpperCase()
        );
        console.log(unixDateToLocalDate(payment.created));

        console.log(invoice.hosted_invoice_url);
        console.log(unixDateToLocalDate(invoice.lines.data[0].period.end));
        console.log(unixDateToLocalDate(invoice.lines.data[0].period.start));
      });
      parentDiv.innerHTML=innerText;
    }
  }, [paymentDetails]);

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
              setsavefName(firstName);
              setsavelName(lastName);
              alert("Changes has been successfully updated");
            }
          });
      }
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
      console.log(firstName);
    }
    if (!!$el.closest("#last-name").get(0)) {
      setLastName($el.closest("#last-name").val());
      console.log(lastName);
    }
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
