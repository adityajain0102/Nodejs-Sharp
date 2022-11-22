'use strict';

const config = {
    local: {
        port: 9005,
        baseUrl: 'http://localhost:9005/',
        baseUrlElite: 'http://localhost:9005/',
        SECRET: 'crm@$12&*01',

        DATABASE: {
            DB_URL: "mongodb+srv://admin:admin@12345@cluster-sharp.gmgdr7e.mongodb.net/?retryWrites=true&w=majority"

        },
    }
};
module.exports.get = function get(env) {
    return config[env] || config.default;
}