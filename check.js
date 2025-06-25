const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const { paymentMethodId, amount } = JSON.parse(event.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      capture_method: "manual"
    });

    if (paymentIntent.status === "requires_capture") {
      return { statusCode: 200, body: JSON.stringify({ message: "✔️ Thẻ hợp lệ và đủ tiền!" }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ message: "❌ Không đủ tiền hoặc trạng thái không rõ." }) };
    }
  } catch (err) {
    return { statusCode: 200, body: JSON.stringify({ message: `❌ Lỗi: ${err.message}` }) };
  }
};
