const jwt = require("jsonwebtoken"); //Imports jsonwebtoken since we will need it any time a user logs in or signs up.
const { UserModel } = require("../models"); //this allows us to communicate with our user model to get more information about our user.

const validateJWT = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    //this is a conditional statement checking the method of the request (Post, Get, Put, Delete.)
    next(); //next is a nested middleware function to pass control to the next middleware function. (Preflight?)
  } else if (
    //if we are dealing with POST, GET, PUT, or DELETE his checks for authorization AND to determine if it incldes "BEARER"
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer")
  ) {
    const { authorization } = req.headers;
    // console.log("authorization -->", authorization);
    const payload = authorization //pulls the value of authorization and stores it in payload
      ? jwt.verify(
          authorization.includes("Bearer")
            ? authorization.split(" ")[1]
            : authorization,
          process.env.JWT_SECRET //allows payload to equal a truthy value.
        )
      : undefined; //This gets stored in payload if the jwt.verify function returns a falsy value.
    console.log("payload -->", payload);

    if (payload) {
      //this function triggers if payload is truthy (something other than null, 0, false, or undefined)
      let foundUser = await UserModel.findOne({
        where: {
          id: payload.id, //if this finds a user with a matching id, that vale gets stored in the user variable.
        },
      });
      //    console.log("foundUser -->", foundUser);
      if (foundUser) {
        // console.log("request -->", req)
        req.user = foundUser;
        next(); //exits us out of the function.
      } else {
        res.status(400).send({ message: "Not Authorized" }); //Unable to find a user
      }
    } else {
      res.status(401).send({ message: "Invalid token" }); //payload is undefined
    }
  } else {
    res.status(403).send({ message: "Forbidden" }); //empty request or missing the word "Bearer"
  }
};

module.exports = validateJWT;
