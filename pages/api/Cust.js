const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  const subscriptions = await stripe.subscriptions.list({
    customer:'cus_Ln4rlFoDAWP7ZV',
    status:'active',
    price:"price_1L5DdySJgRJkBQqsN61ybzli"

  });
    res.status(200).json({ subscriptions:subscriptions.data  })
  }
  

