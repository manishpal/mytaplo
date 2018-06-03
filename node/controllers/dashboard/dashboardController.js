const jsonHelper = require('../../controllers/utils/getResponseController');

exports.getMetaInfo = (req,res) => {
    const metaInfo = {"todayRevenue" : 10, "todayViews": 500, "totalRevenue" :100 };
    res.status(200).json(jsonHelper.getResponse("Success",null,metaInfo));
}