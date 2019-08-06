"use strict";
const Factory = use("Factory");

const { test, trait } = use("Test/Suite")("Article Controller");
trait("Test/ApiClient");

test("List Article Test", async ({ client }) => {
  const articles = await Factory.model("App/Models/Article").createMany(3);

  const response = await client.get("articles").end();

  const body = [];

  articles.forEach(article => {
    body.push({
      title: article.title,
      body: article.body
    });
  });

  response.assertStatus(200);

  response.assertJSONSubset({
    status: 200,
    data: body
  });
});

test("Show Article Test", async ({ client }) => {
  const article = await Factory.model("App/Models/Article").create();

  const response = await client.get(`articles/${article.id}`).end();

  response.assertStatus(200);

  response.assertJSONSubset({
    status: 200,
    data: {
      id: article.id,
      title: article.title,
      body: article.body,
      created_at: article.created_at,
      updated_at: article.updated_at
    }
  });
});
