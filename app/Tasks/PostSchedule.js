"use strict";

const Task = use("Task");
const Article = use("App/Models/Article");

class PostSchedule extends Task {
  static get schedule() {
    // See: https://crontab-generator.org/
    return "0 0 * * * *";
  }

  async handle() {
    const date = new Date();
    const nowDate = `${date.getFullYear()}-${date
      .getMonth()
      .toString()
      .padStart(2, "0")}-${date
      .getDay()
      .toString()
      .padStart(2, "0")}`;

    await Article.query()
      .where("is_published", 0)
      .where("schedule_date", nowDate)
      .update({
        is_published: 1
      });
  }
}

module.exports = PostSchedule;
