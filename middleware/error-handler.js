const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customerror = {
    statuscode:err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'something went wrong try again'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.name === 'ValidationError'){
    console.log(Object.values(err.errors))
    customerror.msg = Object.values(err.errors)
    .map((item)=> item.message)
    .join(',')
    customerror.statuscode = 400
  }
  if(err.code && err.code === 11000){
    customerror.msg = `dublicate value entered for ${Object.keys(err.keyValue)} field please choose another value`;
    customerror.statuscode = 400;
  }
  if(err.name === 'CastError'){
    customerror.msg = `no item found with id ${err.value}`;
    customerror.statuscode = 404;
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customerror.statuscode).json({ msg:customerror.msg });
}

module.exports = errorHandlerMiddleware
