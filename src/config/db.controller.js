const {db_bild} = require('./db.service')

module.exports = {

    db_bild: (req, res) => {
        const db_do = req.body['db_bild'];
        console.log(db_do)
        if (db_do == 'Yes') {
            db_bild((err, results) => {
                if (err) {
                    console.log(err);
                }
                if (results) {
                    return res.json({
                        success: 1,
                    });
                }
            });

        } else {
            return res.json({
                success: 0,
            });
        }
    },
}