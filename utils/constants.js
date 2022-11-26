const URL_REG_EXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/i;
const UNIQUE_ERROR_CODE = 11000;
const SECRET_KEY = '3c574a35e06371bba21dd76a7b43b6e5ed8af68f6db0c6e8dd829c711af29e85';

module.exports = { URL_REG_EXP, UNIQUE_ERROR_CODE, SECRET_KEY };
