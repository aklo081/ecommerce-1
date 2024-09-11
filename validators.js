const Joi = require('joi');

const validate = (schema) =>(payload) => schema.validate(payload);

const categorySchema = Joi.object({
    name: Joi.string().min(5).max(250).required(),
    description: Joi.string().required()
});

//product schema
const productSchema = Joi.object({
    category: Joi.string().required(),
    name: Joi.string().required().min(5),
    mileage: Joi.string().required(),
    exteriorColor: Joi.string().required(),
    interiorColor: Joi.string().required(),
    engine: Joi.string().required(),
    horsePower: Joi.number().required(),
    engineCapacity: Joi.string().required(),
    seats: Joi.number().required(),
    transmission: Joi.string().required(),
    vin: Joi.string().required(),
    stock: Joi.string().required(),
    price: Joi.number().required(),
    pricetxt: Joi.string().required(),
    description: Joi.string().required(),
    // images: Joi.array().required(),
    // images: Joi.array().required().items({
    //     img: Joi.string().required()
    // }),
    featured: Joi.boolean(),
    topSelling: Joi.boolean(),
})


const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().required(),
})

module.exports.validateCategory = validate(categorySchema);
module.exports.validateProduct = validate(productSchema);
module.exports.validateUser = validate(userSchema);