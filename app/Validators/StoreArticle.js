"use strict";

class StoreArticle {
  get rules() {
    return {
      title: "required|string",
      body: "required|string"
    };
  }
}

module.exports = StoreArticle;
