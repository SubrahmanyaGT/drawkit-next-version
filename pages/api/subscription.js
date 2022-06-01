export default async function handler(req, res) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const subscription = await stripe.subscriptions.create({
    customer: "cus_LmiJLr2we6I8Hn",
    items: [{ price: "price_1KUTf8SE7JJDuv9XiNDADS1i" }],
  });

  res.status(200).json({ subscription });
}
