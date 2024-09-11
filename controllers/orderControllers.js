const Cart = require('../models/cart');
const Order = require('../models/order');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');


dotenv.config();

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

exports.initiatePayment = async (req, res) => {
    const { user } = req;
    const { amount, currency, firstName, lastName, email, address, phone } = req.body;

    try {
        const cart = await Cart.findOne({ user: user.id })
        if (!cart || cart.products.length === 0) {
            res.json("Cart not found")
        }

        const orderId = uuidv4();
        const paymentData = {
            tx_ref: orderId,
            amount,
            currency,
            // redirect_url: 'https://localhost:5173/thankyou',
            redirect_url: 'http://localhost:5173/thankyou',
            customer: {
              email: `${user.email}`,
              name: `${user.firstName} ${user.lastName}` ,
              phonenumber: phone
            },
            meta: {
                firstName,
                lastName,
                email,
                phone,
                address,
            },
            customizations: {
                title: "Joe's Autos Payment for Cart Items",
                description: "Payment Success"
            }
          }

          const response = await fetch('https://api.flutterwave.com/v3/payments',{
            method: "POST",
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
          });

          const data = await response.json();

          if (data.status === "success") {
            res.json({ link: data.data.link, orderId })
          } else {
            res.json("Payment failed")
          }
    } catch (error) {
        console.log({ message: error.message })
    }
}

exports.verifyPayment = async (req, res) => {
    const { transaction_id, orderId} = req.body;

    try {
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            method: "GET", 
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
            }
        })

        const data = await response.json();
        if (data.status === "success") {
            const cart = await Cart.findOne({ user: req.user.id}).populate("products.product");
            if (!cart || cart.products.length === 0) {
                res.json("Cart not found")
            }

            const order = new Order({
                user: req.user.id,
                orderId,
                firstName: data.data.meta.firstName,
                lastName: data.data.meta.lastName,
                email: data.data.meta.email,
                phone: data.data.meta.phone,
                address: data.data.meta.address,
                status: "complete",
                transactionId: transaction_id,
                amount: data.amount,
                quantity: data.quantity,
            });

            // const mailOption = {
            //     from: process.env.EMAIL_USER,
            //     to: data.data.mata.email,
            //     subject: `Hello${user.firstName}`,
            //     text: `Hello ${user.firstName}, you have succesfully made payments for items in your cart`
            // }

            // await WebTransportError.sendMail(mailOption)

            await order.save()

            await Cart.findOneAndDelete({ user: req.user.id })
            res.json({ message: "Payment Successful", order})
        }else {
            res.json({ message: "Payment Failed "});
        }
    } catch (error) {
        console.log({ message: error.message });
    }
}