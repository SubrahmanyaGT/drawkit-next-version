const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const subscription = await stripe.subscriptions.create({
        customer: 'cus_M1FWsh3bqz9VfS',
        payment_behavior:'default_incomplete',
        items: [
          {price: 'price_1KYEiyFrgbA3kZrFUztTyUKR'},
        ],
      });
  res.status(200).json({ subscriptions: subscription })
}