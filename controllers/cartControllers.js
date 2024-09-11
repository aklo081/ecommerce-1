const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("products.product")
        if (!cart) {
            cart = new Cart({ user: req.user.id, products:[] })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product Not Found!..." })
        }

        const productItems = cart.products.findIndex( items => items.product._id.toString() === productId )

        if (productItems !== -1) {
            cart.products[productItems].quantity += quantity
            cart.products[productItems].amount = product.price * cart.products[productItems].quantity
        } else {
            cart.products.push ({
                product: productId,
                quantity: quantity,
                amount: product.price * quantity
            })
        }
        const savedcart = await cart.save();
        await savedcart.populate("products.product");
        res.json(savedcart);

    } catch (error) {
        console.log({message: error.message});
    }
}

exports.getCart = async (req, res) => {
    try {
       const cart = await Cart.findOne({ user: req.user.id }).populate("products.product") ;
       if (!cart) {
            req.status(400).json({ message: "Cart does not exist" })
       }
       res.json(cart)
    } catch (error) {
        console.log({ message: error.message })
    }
}

exports.updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.user.id });
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: "Product Not found!.."})
      }
      if (!cart) {
        return res.status(400).json({ message: "Cart Not Found!.."})
      }  

      const cartItem = cart.products.find(items => items.product.toString() === productId)

      if (cartItem) {
        cartItem.quantity = quantity
        cartItem.amount = product.price * cartItem.quantity
        await cart.save()

        const updatedCart = await Cart.findOne({ user: req.user.id }).populate("products.product")
        res.json(updatedCart)

      } else {
        res.json({ message: "Cart Does Not exist" })
      }

    } catch (error) {
        console.log({message: error.message})
    }
}

exports.deleteCartItems = async (req, res ) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ message: "product is not found" })
        if (cart)     {
            cart.products = cart.products.filter(items => items.product.toString() !== productId )
            await cart.save();

            const updateCart = await Cart.findOne({ user: req.user.id }).populate("products.product")
            res.json(updateCart)
        }else {
            return res.status(400).json({ massage: "Cart Not Found!.." })
        }
    } catch (error) {
        console.log({ message: error.message })
    }
}