const User = require('../models/users');
const bcrypt = require('bcryptjs');
const { validateUser } = require('../validators');

exports.register = async (req, res) => {
    const { firstName, lastName, password, confirmPassword, email, phone, role } = req.body;

    if ( password != confirmPassword) {
        return res.status(400).json({ message: "Password do not match"})
    }

    let { error } = validateUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message})
    }

    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists!..." })
        }

        user = new User({ firstName, lastName, password, confirmPassword, email, phone, role });
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()
        res.json(user)

    } catch (error) {
        console.log({ message: error.message });
        return res.status(500).json({message: "Server error, something went wrong!..."})
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })  
        if (!user) {
            return res.status(400).json({ message: "Invalid email" })
        }

        const validatePassword = await bcrypt.compare( password, user.password)
        if (!validatePassword) {
            return res.status(400).json({ message: "Invalid password" })
        }
        //await user.save();

        const token = user.generateAuthToken();
        res.header("auth-token", token).json({ token })

    } catch (error) {
        console.log({ message: error.message })
        return res.status(500).json({message: "Server error, something went wrong!..."})
    }
}

exports.getUser = async ( req, res) => {
    try {
        const user = await User.findOne ({ user: req.user_id})
        if (!user) {
            req.status(400).json({ message: "Not Found"})
        }
    } catch (error) {
        console.log({ message: error.message })
    }
}