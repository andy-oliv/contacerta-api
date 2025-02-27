const HTTP_MESSAGES = {
  global: {
    status_403: 'You need to be logged in to access this content.',
  },
  user: {
    create: {
      status_200: 'User successfully created.',
      status_409:
        'This email has already been used before. Please choose a different email for registration. ',
      status_500:
        'An unexpected error occurred while creating the user. Please check the error log for more information.',
    },
    fetchAll: {
      status_200: 'Users successfully fetched.',
      status_404: 'There are no users to show.',
      status_500:
        'An unexpected error occurred while fetching the users. Please check the error log for more information.',
    },
    fetchOne: {
      status_200: 'User succesfully fetched.',
      status_404: 'User not found or the id sent is incorrect.',
      status_500:
        'An unexpected error occurred while fetching the user. Please check the error log for more information.',
    },
    update: {
      status_200: 'User succesfully updated.',
      status_400:
        'User trying to update data with an empty body. There is nothing to update.',
      status_404: 'User not found or the id sent is incorrect.',
      status_500:
        'An unexpected error occurred while updating the user. Please check the error log for more information.',
    },
    delete: {
      status_200: 'User succesfully deleted.',
      status_404: 'User not found or the id sent is incorrect.',
      status_500:
        'An unexpected error occurred while deleting the user. Please check the error log for more information.',
    },
  },
  auth: {
    login: {
      status_200: 'User successfully logged in.',
      status_400: 'Either the email or the password is wrong. Please check.',
      status_500:
        'An unexpected error occurred while loggin in the user. Please check the error log for more information.',
    },
    logout: {
      status_200: 'User successfully logged out.',
      status_500:
        'An unexpected error occurred while logging out the user. Please check the error log for more information.',
    },
    register: {
      status_200: 'User successfully registered.',
      status_409:
        'This email has already been used before. Please choose a different email for registration. ',
      status_500:
        'An unexpected error occurred while registering the user. Please check the error log for more information.',
    },
  },
};

export default HTTP_MESSAGES;
