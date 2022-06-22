import { supabase } from "../../utils/supabaseClient";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);

  let response = await supabase
    .from("stripe_users")
    .select("*")
    .eq("user_id", userdetails.user_id);
  let stripeUser = response.body[0];
  console.log(stripeUser);
  const subscriptions = await stripe.subscriptions.list({
    limit: 1,
    status: "active",
    price: "price_1KYEiyFrgbA3kZrFUztTyUKR",
    customer: stripeUser.stripe_user_id, //userdetails.customer,
  });
  if (subscriptions.data[0]) res.status(200).json(subscriptions.data[0]);
  else res.status(200).json({ status: "inactive" });
}
