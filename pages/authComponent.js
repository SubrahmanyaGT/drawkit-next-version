import { useEffect } from "react"
import { supabase } from "../utils/supabaseClient";
import { useTheme } from '../lib/authInfo'


export default function InitUser(props) {
  const { theme, setTheme } = useTheme()
console.log(theme);
    useEffect(() =>{
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
              
                    setTheme({foreground: data.status, background: '#'});
                });
            });
        }
        props.setLoading(false);
      },[])

    return(<></>)
}