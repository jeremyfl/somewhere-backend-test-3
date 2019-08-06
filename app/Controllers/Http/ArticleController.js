"use strict";
const Article = use("App/Models/Article");

/**
 * Resourceful controller for interacting with articles
 */

class ArticleController {
  async live({ view }) {
    const articles = await Article.query()
      .where("is_published", true)
      .orderBy("id", "desc")
      .fetch();

    return view.render("article", {
      articles: articles.toJSON()
    });
  }

  async index({ response }) {
    const articles = await Article.query()
      .where("is_published", true)
      .with("user")
      .fetch();

    return response.send({
      status: 200,
      data: articles
    });
  }

  async store({ request, response, auth }) {
    const payload = request.only(["title", "body", "user_id", "schedule_date"]);

    const user = auth.user;

    if (!payload.schedule_date) {
      payload.is_published = 1;
    }

    const article = await Article.create({
      ...payload,
      user_id: user.id
    });

    return response.send({
      status: 200,
      data: article
    });
  }

  async show({ params, response }) {
    const articles = await Article.query()
      .where("id", params.id)
      .where("is_published", true)
      .with("user")
      .firstOrFail();

    return response.send({
      status: 200,
      data: articles
    });
  }

  async update({ params, request, response }) {
    const payload = request.only(["title", "body"]);

    await Article.query()
      .where("id", params.id)
      .update(payload);

    return response.status(201).send({
      status: 201,
      message: "Record updated"
    });
  }

  async destroy({ params, response }) {
    const article = await Article.findOrFail(params.id);

    await article.delete();

    return response.status(201).send({
      status: 200,
      message: "Record deleted"
    });
  }
}

module.exports = ArticleController;
