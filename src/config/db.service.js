const pool = require('./database');


module.exports = {
    db_bild: callback => {

        pool.query(
            "DROP TABLE IF EXISTS api_users;\
            CREATE TABLE api_users(ID SERIAL PRIMARY KEY,\
                FIRSTNAME CHAR(15),LASTNAME CHAR(15),\
                EMAIL  TEXT NOT NULL,PHONE  TEXT NOT NULL, \
                USERNAME  TEXT NOT NULL, PASSWORD TEXT NOT NULL,\
                REGISTER BOOL DEFAULT 'F',\
                CREATE_AT TIMESTAMPTZ DEFAULT Now());",
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results)
            }
        );
    },
}