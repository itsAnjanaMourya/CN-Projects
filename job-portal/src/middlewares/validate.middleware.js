import { body } from "express-validator";

export const jobValidators = [
  body("job_category").trim().notEmpty().withMessage("Job category is required"),
  body("job_designation").trim().notEmpty().withMessage("Designation is required"),
  body("job_location").trim().notEmpty().withMessage("Location is required"),
  body("company_name").trim().notEmpty().withMessage("Company name is required"),
  body("salary").trim().notEmpty().withMessage("Salary is required"),
  body("apply_by").isISO8601().withMessage("Apply by must be a valid date"),
  body("number_of_openings")
    .isInt({ min: 1 })
    .withMessage("Openings must be >= 1"),
];


export const applyValidators = [
  body("name").trim().notEmpty(),
  body("email").isEmail(),
  body("contact").trim().notEmpty()
];

export const authValidators = {
  register: [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  login: [
    body("email").isEmail(),
    body("password").notEmpty()
  ]
};
