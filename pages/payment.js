import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
export default function Payment() {
  function paypalPaymentHandler() {}
  const initialOptions = {
    "client-id":
      "ARZC0Z455LGovW9_0_oB5IjFmohBG7W9SRW8q7kAxS78DsZGAuVpiJR-dvUu8ILBdtz5wJ_PzOYV2m8K",
    currency: "USD",
    intent: "capture",
  };
  return (
    <>
      <div
        style={{
          marginTop: "200px",
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "100px",
        }}
      >
        {" "}
        <button className="w-button">Stripe</button>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons style={{ layout: "horizontal" }} />
        </PayPalScriptProvider>
      </div>
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_top"
      >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="3B2QNE3NTQ53C" />
        <table>
          <tr>
            <td>
              <input type="hidden" name="on0" value="coopon" />
              coopon
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" name="os0" maxlength="200" />
            </td>
          </tr>
        </table>
        <input
          type="image"
          src="https://www.paypalobjects.com/en_GB/i/btn/btn_subscribeCC_LG.gif"
          border="0"
          name="submit"
          alt="PayPal – The safer, easier way to pay online!"
        />
        <img
          alt=""
          border="0"
          src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif"
          width="1"
          height="1"
        />
      </form>
    </>
  );
}
