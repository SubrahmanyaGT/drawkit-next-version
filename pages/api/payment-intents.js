const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    let subsdetails = JSON.parse(req.body);

  const paymentIntents = await stripe.paymentIntents.list({
    limit: 3,
    customer: subsdetails.customer,
  });
  const invoices = await stripe.invoices.list({
    limit: 3,
    customer: subsdetails.customer,
  });

  res.status(200).json({ paymentIntents, invoices });
}
