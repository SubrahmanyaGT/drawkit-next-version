const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function subscriptionsCancle(req, res) {
  let userdetails = JSON.parse(req.body);
  const subscriptions = await stripe.subscriptions.list({
    price: "price_1KYEiyFrgbA3kZrFUztTyUKR",
    customer:userdetails.customer,
  });
  
  if (subscriptions.data.length > 0) {
    let deleted =[]
    subscriptions.data.forEach(async (sub) => {
        deleted.push( await stripe.subscriptions.del(
            sub.id
          ))
          res.status(200).json({ deleted});
    });

    
    
  } else res.status(200).json({ error: "Nothing to delete" });
}
