const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);
  
  let custCheck = await stripe.customers.list({
    email: userdetails.email,
  });

  let data = { customer: null, errors: null };
  if (custCheck.data.length <= 0) {
    data.customer = await stripe.customers.create({
      name: userdetails.email,
      email: userdetails.email,
    });
  } else {
    data.errors = "Email" + userdetails.email + "already exists";
  }
  res.status(200).json({ data });
}
