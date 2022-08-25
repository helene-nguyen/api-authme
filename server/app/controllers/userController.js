//~ Import Debug
import debug from 'debug';
const logger = debug('Controller');
//~ Import modules
import { User } from '../datamappers/index.js';
import { ErrorApi } from '../services/errorHandler.js';
//~ Security
import bcrypt from 'bcrypt';
//~ Authorization
import { generateAccessToken, generateRefreshToken } from '../services/jsonWebToken.js';

//~CONTROLLERS
async function fetchAllUsers(req, res) {
  try {
    const users = await User.findAll();

    if (!users) throw new ErrorApi(`No users found`, req, res, 400);

    return res.status(200).json(users);
  } catch (err) {
    logger(err.message);
  }
}

async function fetchOneUser(req, res) {
  try {
    const userId = req.params.userId;

    if (typeof userId !== 'string') throw new ErrorApi(`Id must be a string`, req, res, 400);

    const user = await User.findOne(userId);

    if (!user) throw new ErrorApi(`User doesn't exist`, req, res, 400);

    return res.status(200).json(user);
  } catch (err) {
    logger(err.message);
  }
}

async function doSignUp(req, res) {
  try {
    let { email, password, passwordConfirm } = req.body;

    if (email) {
      const userExist = await User.findUser({email});
      if (userExist) throw new ErrorApi(`User already exists !`, req, res, 401);
    }

    //~ Encrypt password if password exist
    if (password !== passwordConfirm) throw new ErrorApi(`Please enter the same password`, req, res, 401);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    //replace password in body
    req.body.password = password;

    //~ Add role + remove passwordconfirm
    // console.log("\x1b[1;34m ---------------------------------------\x1b[0m ");
    // console.log("✨\x1b[1;34m YOU BODY BEFORE ADDING SOMETHING:\x1b[0m ", req.body);
    
    req.body = { ...req.body, role: 'user' };
    const { ['passwordConfirm']: remove, ...user } = req.body;
    
    //~ Create user
    // const userCreated = await User.create(user);

    return res.status(201).json(`User created successfully !`);
  } catch (err) {
    logger(err.message);
  }
}

async function doSignIn(req, res) {
  try {
    console.log(req.body.email);

    res.json('none');
  } catch (err) {
    logger(err.message);
  }
}

async function doSignOut(req, res) {
  try {
    res.json('none');
  } catch (err) {
    logger(err.message);
  }
}

async function updateUser(req, res) {
  try {
    res.json('none');
  } catch (err) {
    logger(err.message);
  }
}

async function deleteUser(req, res) {
  try {
    res.json('none');
  } catch (err) {
    logger(err.message);
  }
}


export { fetchAllUsers, fetchOneUser, doSignUp, doSignIn, doSignOut, updateUser, deleteUser } ;
