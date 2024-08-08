const { body, checkSchema } = require("express-validator");

exports.checkUserCredentials = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("No username provided.")
      .trim()
      .isLength({ min: 6 })
      .withMessage("The username must be longer than 6 characters.")
      .escape(),

    body("password").notEmpty().withMessage("No password provided.").escape(),
  ];
};

exports.checkProfileInfo = () => {
  return [
    body("profileInfo")
      .notEmpty()
      .withMessage("No profile information.")
      .bail(),

    body("profileInfo.userId").isMongoId().withMessage("Invalid user").escape(),

    body("profileInfo.email").isEmail().withMessage("Invalid email").escape(),
  ];
};

exports.checkPagination = () => {
  return body("pageNum")
    .notEmpty()
    .withMessage("No page number assinged.")
    .escape();
};

exports.checkUserSchema = () => {
  return checkSchema({
    username: {
      isString: true,
      min: 6,
      errorMessage: "Must have a valid username",
    },
    password: { isString: true, errorMessage: "Must have a valid password" },
  });
};

exports.checkRoomSchema = () => {
  return [
    checkSchema({
      "roomInfo.users": { isArray: { options: { min: 2 } } },
    }),
  ];
};

exports.checkMessageSchema = () => {
  return [
    checkSchema({
      "messageInfo.userId": {
        isMongoId: true,
        errorMessage: "Must have the sender Id.",
      },
      "messageInfo.message": {
        isString: { options: { min: 1 } },
        notEmpty: true,
      }
    }),
  ];
};
