"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ArticleSchema extends Schema {
  up() {
    this.create("articles", table => {
      table.increments();
      table.string("title");
      table.text("body");
      table.integer("user_id").unsigned();
      table
        .foreign("user_id")
        .references("users.id")
        .onDelete("CASCADE");
      table.bool("is_published").defaultTo(0);
      table.date("schedule_date");
      table.timestamps();
    });
  }

  down() {
    this.drop("articles");
  }
}

module.exports = ArticleSchema;
