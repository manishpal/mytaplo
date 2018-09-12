exports.catchErrors = (fn) => {
    return function(req,res,next) {
        return fn(req,res,next).catch(next);
    }
}

exports.notFound = (req,res,next) => {
    const err = new Error('Route Not Found');
    err.status = 404;
    next(err);
}

exports.developmentErrors = (err,req,res,next) => {
    err.staack = err.stack || '';
    const errorDetails = {
        message : err.message,
        status : err.status,
        stackHighlighted : err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')   
    };
    res.status(err.status || 500).json(errorDetails);
}
