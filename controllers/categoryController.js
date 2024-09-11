const Category = require('../models/category');
const { validateCategory } = require("../validators");

exports.createCategory = async (req, res) => {
    try {
        const { error } = validateCategory(req.body)
        if (error) {
            res.join(error).status(400)
        }
        const category = new Category({
            name: req.body.name,
            description:req.body.description
        })
        
    const new_category_data = await category.save();
    res.json(new_category_data)
    } catch (error) {
        console.log({ message: error.message });
    }
}