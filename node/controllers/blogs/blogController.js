const mongoose = require('mongoose');
const blogModel = mongoose.model('Blog');
const jsonHelper = require('../utils/getResponseController');

exports.getBlogs = async (req,res) => {
    const blogsData = await blogModel.find({});
    res.status(200).json(jsonHelper.getResponse("Success",null,blogsData));
}