
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { status } = router.query;

  const [item, setItem] = useState({
    name: "Download Premium assets",
    description: "Premium",
    quantity: 1,
    price: 1495,
  });

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(publishableKey);
  const createCheckOutSession = async () => {
    const stripe = await stripePromise;
    const checkoutSession = await axios.post("/api/create-stripe-session"
    , {
      item: item,
    }
    );
    console.log(checkoutSession.data.id.customer, 'checkoutSession');
    // const result = await stripe.redirectToCheckout({
    //   sessionId: checkoutSession.data.id,
    // });
    // if (result.error) {
    //   alert(result.error.message);
    // }
  };
  return (
    <div>
      <div>$79/year</div>
      <button
        onClick={createCheckOutSession}
      >Subscribe</button>
    </div>
  );
}
