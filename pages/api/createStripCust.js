const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// async function checkCustomers() {
//   const customers = await stripe.customers.list({
//     email:userdetails.email,
//   });
//   console.log(customers);
//   return true;
// }

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);

  let custCheck = await stripe.customers.list({
    email: userdetails.email,
  });

  let customer = {};
  if (custCheck.data.length <= 0) {
    customer = await stripe.customers.create({
      name: "stripe test customer",
      email: userdetails.email,
    });
  }
  res.status(200).json({ customer });
}
