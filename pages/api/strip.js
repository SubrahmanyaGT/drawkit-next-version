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

export default async function handler(req, res) {
   
  

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: 'price_1KUTf8SE7JJDuv9XiNDADS1i',
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    
    ],
    customer:'cus_LmiJLr2we6I8Hn',
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/canceled.html',
  });
  res.status(200).json({ session })
}