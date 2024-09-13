const User = require("../models/user.model");
const Stripe = require("stripe");
const stripe = require("stripe")(process.env.STRIPE);

const saveData = async (req, res) => {
  try {
    const { name, wallet, email, tokens } = req.body;
    const newUser = new User({ name, email, wallet, tokens });
    await newUser.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tokens Purchase",
            },
            unit_amount: tokens * 100, // Assuming $1 per token
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/?status=success`,
      cancel_url: `http://localhost:5173/?status=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveData };
