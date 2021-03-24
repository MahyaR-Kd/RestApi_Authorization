const { db_bild } = require('./db.service')
    
module.exports = {
    
db_bild: (req, res) =>{
        const db_do = req.body['db_bild'];
        if (db_do == 'Yes') {
            console.log(db_do)
            db_bild((err, results) => {
                if (err) {
                    console.log(err);
                }
                return res.json({
                    success: 1,
                });
            })

        }
        return res.json({
            success: 0,
        });
    },
}