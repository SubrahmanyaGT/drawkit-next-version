const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);

  const subscriptions = await stripe.subscriptions.list({
    limit: 1,
    status: "active",
    price: "price_1L5DdySJgRJkBQqsN61ybzli",
    customer: userdetails.customer,
  });

  res.status(200).json(subscriptions.data[0]);
}
