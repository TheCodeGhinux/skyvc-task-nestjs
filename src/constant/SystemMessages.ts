export const USER_CREATED_SUCCESSFULLY = 'User Created Successfully';
export const USER_CREATED = 'User Created Successfully';
export const FAILED_TO_CREATE_USER = 'Error Occured while creating user, kindly try again';
export const ERROR_OCCURED = 'Error Occured Performing this request';
export const USER_ACCOUNT_EXIST = 'Account with the specified email exists';
export const USER_ACCOUNT_DOES_NOT_EXIST = "Account with the specified email doesn't exist";
export const UNAUTHENTICATED_MESSAGE = 'User is currently unauthorized, kindly authenticate to continue';
export const UNAUTHORIZED_MESSAGE = 'You do not have the permission to perform this action';
export const USER_NOT_FOUND = 'User not found!';
export const INVALID_PASSWORD = 'Invalid password';
export const LOGIN_SUCCESSFUL = 'Login successful';
export const LOGIN_ERROR = 'An error occurred during login';
export const FORBIDDEN_ACTION = 'You do not have the permission to perform this action';
export const RESOURCE_NOT_EXIST = resource => {
  return `${resource} does not exist`;
};
export const RESOURCE_NOT_FOUND = resource => {
  return `${resource} not found`;
};
export const RESOURCE_FOUND = resource => {
  return `${resource} fetched successfully`;  
};
export const RESOURCE_CREATED = resource => {
  return `${resource} created successfully`;  
};
export const RESOURCE_UPDATED = resource => {
  return `${resource} updated successfully`;  
};
export const RESOURCE_FAILED = resource => {
  return `${resource} failed`;  
};
export const RESOURCE_DELETED = resource => {
  return `${resource} deleted successfully`; 
};

export const BAD_REQUEST = 'Bad request error';
export const INVALID_CREDENTIALS = 'Invalid credentials';
export const WRONG_PASSWORD = 'Email or password is incorrect';
