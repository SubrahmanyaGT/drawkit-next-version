const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  const session = await stripe.customers.retrieve(
    'cus_LmiJLr2we6I8Hn'
  );
    res.status(200).json({ session })
  }
  

