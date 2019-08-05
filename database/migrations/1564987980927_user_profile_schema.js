"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserProfileSchema extends Schema {
  up() {
    this.create("user_profiles", table => {
      table.increments();
      table.string("full_name");
      table.text("address");
      table.string("photo_url");
      table.integer("user_id").unsigned();
      table
        .foreign("user_id")
        .references("users.id")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("user_profiles");
  }
}

module.exports = UserProfileSchema;
