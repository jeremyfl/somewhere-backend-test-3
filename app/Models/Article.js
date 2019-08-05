"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Article extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }

  static get hidden() {
    return ["schedule_date", "is_published", "user_id"];
  }
}

module.exports = Article;
