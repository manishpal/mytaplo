const mongoose = require('mongoose');
const blogModel = mongoose.model('Blog');
const jsonHelper = require('./getResponseController');


exports.saveBlogs = async (req,res) => {
    const blogData = {
        title : req.body.title || '',
        url : req.body.url || '',
        imageUrl : req.body.imageUrl || '',
        language : req.body.language || '',
        category : req.body.category || ''
    }
    const savingBlogModel = await new blogModel(blogData).save();

    if(!savingBlogModel) {
        res.status(500).json(jsonHelper.getResponse("Success","Error in saving the blog" + blogData.title ,{}));
    }

    res.status(200).json(jsonHelper.getResponse("Success",null,savingBlogModel));
}