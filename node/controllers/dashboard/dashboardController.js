const viewHelper = require('../../views/view_handler');

exports.home = async (req,res) => {
	console.log("came here");
    return viewHelper.renderViewWithParams({}, res, {view : 'dashboard'})
}