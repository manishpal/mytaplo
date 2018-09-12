exports.getResponse = (status,message,results) => {
    return {status : status || '',message : message || '',results : results || []};
}
