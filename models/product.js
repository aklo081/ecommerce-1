const { string } = require('joi')
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true},
    name: { type: String, required: true },
    mileage: { type: String, required: true },
    exteriorColor: { type: String, required: true },
    interiorColor: { type: String, required: true },
    engine: { type: String, required: true },
    horsePower: { type: Number, required: true},
    engineCapacity: { type: String, required: true },
    seats: { type: Number, required: true },
    transmission: { type: String, required: true },
    vin: { type: String, required: true },
    stock: { type: String, required: true},
    price: { type: Number, required: true },
    pricetxt: { type: String, required: true },
    images: [{ img : { type: Object, required: true }}],
    description: { type: String, required: true },
    featured: { type: Boolean, default:false },
    topSelling: { type: Boolean, default:false}
}, {timestamps: true} )

module.exports = mongoose.model("Product", productSchema);