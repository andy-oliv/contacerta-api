const VALIDATION_MESSAGES = {
  accountDTO: {
    description: {
      isNotEmpty: 'The description field cannot be empty.',
      isString: 'The description must be a string.',
    },
    iconUrl: {
      isNotEmpty: 'The iconUrl field cannot be empty.',
      isString: 'The iconUrl must be a string.',
    },
    color: {
      isNotEmpty: 'The color field cannot be empty.',
      isString:
        'The color needs to be an hex or rbg color code in string format.',
    },
    balance: {
      isNotEmpty: 'The balance field cannot be empty.',
      isNumber:
        'The balance needs to be a number with a maximum of 2 decimal places.',
    },
  },
  userDTO: {
    username: {
      isNotEmpty: 'The username field cannot be empty.',
      isNotString: 'The username must be a string.',
    },
    password: {
      isNotEmpty: 'The password field cannot be empty.',
      isStrongPassword:
        'The password must have at least 8 characters: 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol.',
    },
    email: {
      isNotEmpty: 'The email field cannot be empty.',
      isEmail:
        "The email field must be a valid email following the 'email@mail.com' format.",
    },
  },
};

export default VALIDATION_MESSAGES;
