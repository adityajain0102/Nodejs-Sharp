const jwt = require('jsonwebtoken');
const errorResponce = require('../lib/errorResponce');
const UserModel = require('../api/v1/modules/user/models/user_model');


exports.ensureAuthorized = async (req, resp, next) => {

    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) { return next(new errorResponce('Wrong route authorization failed', 400)) }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SCREATE);
        const user = await UserModel.findById({ _id: decoded.id });
        if (user)
            req.user = user;
       
        next();
    } catch (error) {
        console.log('error---', error)
        return next(new errorResponce('Wrong rout authorization fail', 400))
    }



}
