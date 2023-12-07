import { check } from "express-validator";
export const userValidation = {
  users: [
    check("name")
      .exists()
      .withMessage("Names is required"),
    check("email")
      .exists()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email"),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  ],
};