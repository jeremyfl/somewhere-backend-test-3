"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    if (error.name === "HttpException") {
      return response.status(404).send({
        status: 404,
        message: "Endpoint not found"
      });
    }

    if (error.name === "InvalidJwtToken") {
      return response.status(401).send({
        status: 401,
        message: "Invalid JWT Token"
      });
    }

    if (error.code === "E_MISSING_DATABASE_ROW") {
      return response.status(401).send({
        status: 401,
        message: "Record not found"
      });
    }

    response.status(error.status).send(error.message);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
