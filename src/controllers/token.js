const jwt = require('jsonwebtoken');

const RefreshToken = require('../models/Refreshtoken');
const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = require('../common/config');


module.exports.postRefreshToken = async function(req, res) { 

  const refreshToken = req.header("Authorization");
  console.log('refreshToken from header--', refreshToken);

  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(403).json({
      message: "Token not found"
    });
  };

  // If token does not exist, send error message
  const isRTokenInDB = await RefreshToken.findOne({refreshToken: refreshToken});

  if (!isRTokenInDB) {
    res.status(403).json({
      message: "Invalid refresh token"   
    });
  };

  try { 
    
    const user = await jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET_KEY
    );
    
    const { email, userId } = user;

    const accessToken = await jwt.sign(
      { email, userId },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    
    res.json({ accessToken });
  } catch (error) {   
    res.status(403).json({
      message: "Invalid token"
    });
  }
};

module.exports.saveRefreshTokenToDB = async function(refreshToken) {
  const refreshToken2 = new RefreshToken({
    'refreshToken': refreshToken
  });

  try {
    await refreshToken2.save();
    console.log('refreshToken added to DB successfully');
  } catch(err) {
    console.log('error, could not add RT to DB');
  }
}


module.exports.deleteAllRefreshTokens = async function() {
  try {
    await RefreshToken.deleteMany();
    return 'RTdeleted';
  } catch(err) {
    console.log('could not delete refreshTokens from DB');
  }
} 


