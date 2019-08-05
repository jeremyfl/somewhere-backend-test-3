"use strict";

class StoreArticle {
  get rules() {
    return {
      email: "required|string",
      full_name: "required|string",
      password: "required"
    };
  }
}

module.exports = StoreArticle;
