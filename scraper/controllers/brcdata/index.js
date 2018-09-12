const jsonHelper = require('../utils/getResponseController');
const iecData = require('../utils/iec_fetch');
exports.index = async (req,res) => {
  await iecData();
  res.status(200).json(jsonHelper.getResponse("Success",null,{data : []}));
}
