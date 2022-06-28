const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  let subsdetails = JSON.parse(req.body);
  let subsCheck = await stripe.customers.list({
    active: subsdetails.active,
  });

  let subscustomer = {};
  if (subsCheck.data.length <= 0) {
    subscustomer = await stripe.subscriptions.list({
      customer: subsdetails.data.customer,
      status: subsdetails.data.status,
      price: subsdetails.data.price
    });
  }

  res.status(200).json({ subscriptions: subscustomer.data })
}