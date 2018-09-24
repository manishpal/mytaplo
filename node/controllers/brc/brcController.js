const viewHelper = require('../../views/view_handler');
exports.index = async (req,res) => {
	return viewHelper.renderViewWithParams({layout : 'seawise_layout'}, res, {view : 'brcHome'})
}
