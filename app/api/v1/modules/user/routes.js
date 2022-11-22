
module.exports = function (express) {
    var router = express.Router()

    // user
    require('../user/routes/user_routes')(router);

    return router;
}
