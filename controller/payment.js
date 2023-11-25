import stripePackage from 'stripe';

const stripe = stripePackage(process.env.PAYMENT_SECRET_KEY);
console.log(process.env.PAYMENT_SECRET_KEY)

const payment = async (req, res) => {
  try {
    const { amount, currency, source } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });

    // Handle the success response
    res.json({ success: true, charge });
  } catch (error) {
    console.error(error);
    // Handle the error response
    res.status(500).json({ success: false, error: error.message });
  }
};

export {payment}