const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  
    const customer = await stripe.customers.create({
        // description: ' FreeCustomer',
        name:'FreeCustomer',
        email: 'FreeCustomer@gmail.com',
      });
    res.status(200).json({ customer })
  }
  

