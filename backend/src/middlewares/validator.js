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

    body("password")
      .notEmpty()
      .withMessage("No password provided.")
      .escape(),
  ];
};

exports.checkPagination = () => {
    return (
        body("pageNum")
        .notEmpty()
        .withMessage("No page number assinged.")
        .escape()
    );
}

exports.checkUserSchema = () => {
    return (
        checkSchema({
            username: { isString: true, min: 6, errorMessage: 'Must have a valid username'},
            password: { isString: true, errorMessage: "Must have a valid password"},
        })
    )
}

exports.checkRoomSchema = () => {
    return (
        checkSchema({
            name: { isString: true, errorMessage: 'Must have a valid name'},
            tags: { isIn: [['Sports', 'Gaming', 'Politics', 'Others']], errorMessage: 'Unidentified Tag'},
        })
    )
}

