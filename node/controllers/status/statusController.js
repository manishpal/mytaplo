exports.getStatus = (req,res) => {
    const statusJson = {"status":"Success","message":"Application is working normally"};
    res.status(200).json(statusJson);
}