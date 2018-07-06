const viewHelper = require('../../views/view_handler');

exports.index = async (req,res) => {
    return viewHelper.renderViewWithParams({}, res, {view : 'home'})
}