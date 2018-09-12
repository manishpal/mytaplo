const jsonHelper = require('../utils/getResponseController');
exports.index = async (req,res) => {
  res.status(200).json(jsonHelper.getResponse("Success",null,{data : []}));
}
