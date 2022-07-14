// const express = require('express')
// // const bodyparser = require('body-parser')
// // const path = require('path')
// const app = express()

// var Publishable_Key = '###publishablekey###'
// var Secret_Key = '###secretkey#####'

// const stripe = require('stripe')(Secret_Key)

// const port = process.env.PORT || 80

// // app.use(bodyparser.urlencoded({extended:false}))
// // app.use(bodyparser.json())

// // View Engine Setup
// // app.set('views', path.join(__dirname, 'views'))
// // app.set('view engine', 'ejs')

// app.get('/', function(req, res){
//     res.render('Home', {
//     key: Publishable_Key
//     })
// })

// app.post('/payment', function(req, res){

//     // Moreover you can take more details from user
//     // like Address, Name, etc from form
//     stripe.customers.create({
//         email: req.body.stripeEmail,
//         source: req.body.stripeToken,
//         name: 'Gautam Sharma',
//         address: {
//             line1: 'TC 9/4 Old MES colony',
//             postal_code: '110092',
//             city: 'New Delhi',
//             state: 'Delhi',
//             country: 'India',
//         }
//     })
//     .then((customer) => {

//         return stripe.charges.create({
//             amount: 7000,    // Charing Rs 25
//             description: 'Web Development Product',
//             currency: 'USD',
//             customer: customer.id
//         });
//     })
//     .then((charge) => {
//         res.send("Success") // If no error occurs
//     })
//     .catch((err) => {
//         res.send(err)    // If some error occurs
//     });
// })

// app.listen(port, function(error){
//     if(error) throw error
//     console.log("Server created Successfully")
// })
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
  let userdetails = JSON.parse(req.body);
  console.log(userdetails);

  let response = await supabase
    .from("stripe_users")
    .select("*")
    .eq("user_id", userdetails.user_id);
  let stripeUser = response.body[0];
  console.log(stripeUser);
  let price = "price_1KYEiyFrgbA3kZrFUztTyUKR";
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const subscriptions = await stripe.subscriptions.list({
    limit: 1,
    status: "active",
    price: price,
    customer: stripeUser.stripe_user_id, //userdetails.customer,
  });

  let session;
  if (subscriptions.data.length <= 0) {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      // discounts: [
      //   {
      //     coupon: "drawkitcoupon",
      //   },
      // ],
      allow_promotion_codes:true,
      customer: stripeUser.stripe_user_id, // userdetails.customer,
      success_url: "https://drawkit-next-version.vercel.app/payment-successful",
      cancel_url: "https://drawkit-next-version.vercel.app/plans",
    });
  } else {
    session = { message: "Already a subscribed customer" };
  }

  res.status(200).json({ session });
}
