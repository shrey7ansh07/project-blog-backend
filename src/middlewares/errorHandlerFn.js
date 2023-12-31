import { ErrorDealer } from "../utilities/errorHandler.js"
function errorHandlerFn(err, req, res, next) {
  if (err instanceof ErrorDealer) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({ message: 'An unexpected error occurred blah blah' });
  }
}

export default errorHandlerFn
