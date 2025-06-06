import { body } from "express-validator"

const userRegistrationValidator = ()=>{
    return [
        body('username')
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min:4})
        .withMessage("Username must be atleast 4 character"),

        body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid Email"),

        body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min:6})
        .withMessage("password must be atleast 6 character"),

        body('firstName')
        .trim()
        .notEmpty()
        .withMessage("firstName is required"),

        body('lastName')
        .trim()
        .notEmpty()
        .withMessage("lastName is required")


    ]
}

const loginValidator = ()=> {
    return[
    body("loginCredential")
      .trim()
      .notEmpty().withMessage("Username or Email is required"),
  
    body("password")
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ];
}

export {userRegistrationValidator,loginValidator}