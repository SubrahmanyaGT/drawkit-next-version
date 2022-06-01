export default async function stripfree(req, res) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "setup",
    line_items: [
      {
        price: "price_1L3zgqSJgRJkBQqsUvnjO0Nx",
        quantity: 1,
      },
    ],
    customer: "cus_Ln4rlFoDAWP7ZV",
    success_url: "http://localhost/",
    cancel_url: "https://example.com/canceled.html",
  });
  res.status(200).json({ session });
}
