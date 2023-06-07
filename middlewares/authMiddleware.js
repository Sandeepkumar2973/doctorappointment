const jwt = require('jsonwebtoken');


const authMiddleware =async (req, res, next) => {
    try {
      const token =  req.headers['authorization']
      const newToken = token.split(' ')[1]
     await jwt.verify(newToken, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          return res.status(200).send({
            message: 'Auth failed',
            success: false
          });
        } else {
          req.body.userId = decode.id;
          next()
        }
      });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: 'Auth failed',
        success: false
      });
    }
  };
  module.exports = authMiddleware;
  