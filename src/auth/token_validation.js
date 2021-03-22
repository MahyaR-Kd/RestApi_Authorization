const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        const token = req.get("authorization").slice(7);

        if (token) {
            verify(token, "aqwesrxctvyibunizxrdctfvygbuh789645", (err, decoded) => {
                if (err) {
                //    console.log(decoded)
                   res.json({
                    success: 0,
                    message: "Invalid token"  
                    }); 
                }else{
                    next();
                }

            })
        }else{
            res.json({
                success: 0,
                message: "Access denied! unauthorized user"
            })
        }
    }
};