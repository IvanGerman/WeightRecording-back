const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = require('../common/config');
const { saveRefreshTokenToDB, deleteAllRefreshTokens } = require('./token');


module.exports.login = async function(req, res) { 

  // check does user already exist
  const isUserThere = await User.findOne({email: req.body.email});
  if (isUserThere) {
    const passwordResult = bcryptjs.compareSync(req.body.password, isUserThere.password);
    if (passwordResult) {
      //password is right, now we generate token
      const token = jwt.sign({
        email: isUserThere.email,
        userId: isUserThere._id
      }, JWT_SECRET_KEY, {expiresIn: "365d"});
      // here we create refresh token, which could be stored in DB or localstorage
      const refreshToken = jwt.sign({
        email: isUserThere.email,
        userId: isUserThere._id
      }, JWT_REFRESH_SECRET_KEY , {expiresIn: "365d"});

      console.log('refreshToken--',refreshToken, typeof(refreshToken));
      const user = await jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET_KEY
      ); console.log('user----',user);


      // here we store our refresh token in DB for later authentication by api/token requests
      // bevor we do it, we clear our token collection in DB
      const result = await deleteAllRefreshTokens();
      if ( result === 'RTdeleted') {
        saveRefreshTokenToDB(refreshToken);
      res.status(200).json({
        token: `Bearer ${token}`,
        refreshToken: refreshToken
      })
      }
    } else {
      res.status(401).json({
        message: 'wrong password!'
      })
    }
  } else {
    res.status(404).json({
      message: 'user not found!'
    })
  }
};

module.exports.register = async function(req, res) {

// check does user with this email already exist
  const isEmailOccupied = await User.findOne({email: req.body.email});
  if (isEmailOccupied) {
    res.status(409).json({
      message: 'user with this email already exists!'
    })
  } else { //create new user
    //first we encode his password
    const salt = bcryptjs.genSaltSync(10);
    const password = req.body.password;

    const user = new User({
      email: req.body.email,
      password: bcryptjs.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch(err) {
      res.status(400).json({
        message: 'error occured'
      })
    }
  } 
}
