import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useTheme } from "../lib/authInfo";
import { Router } from "next/router";



export default function InitUser(props) {
  const { theme, setTheme } = useTheme();
  const[userdata,setUserdata]= useState("");
  console.log("props.auth",props.auth);
  const setAuthInfo=() => {
    if (props.auth) {
      let uid = props.auth.user.id;
      supabase
        .from("stripe_users")
        .select("stripe_user_id")
        .eq("user_id", uid)
        .then(async ({ data, error }) => {
          if (data.length > 0) {
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
                setTheme({ foreground: data.status, background: "#" });
              });
          } else {
            //check stripe for user

            fetch("api/createStripCust", {
              method: "POST",
              headers: {
                contentType: "application/json",
              },
              body: JSON.stringify({
                email: props.auth.user.email,
              }),
            }).then(async (response) => {
              if (response.ok) {
                const { data } = await response.json();
                console.log(data);
                 supabase.from("stripe_users").insert([
                  {
                    stripe_user_id: data.customer.id,
                    stripe_user_email: data.customer.email,
                    user_id: uid,
                  },
                ]).then((data)=>{console.log(data);})
              } else {
                return false;
              }
            });
          }
        });
        props.setLoading(false);
    }
    else{
      props.setLoading(false);
    }
  }
  useEffect(() => {
    console.log('init');
    setAuthInfo()
  }, [props.auth]);

  

  return <></>;
}
