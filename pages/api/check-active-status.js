const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // let userdetails = JSON.parse(req.body);

  const subscriptions = await stripe.subscriptions.list({
    limit: 1,
    status: "active",
    price: "price_1KYEiyFrgbA3kZrFUztTyUKR",
    customer: 'cus_LuwRMy2vVaxm5g',//userdetails.customer,
  });
if(subscriptions.data[0])
  res.status(200).json(subscriptions.data[0]);
  else
  res.status(200).json({"status": "inactive"});

}
