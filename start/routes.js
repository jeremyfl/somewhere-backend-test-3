"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.get("live", "ArticleController.live");

Route.group(() => {
  Route.post("login", "AuthController.login");
  Route.patch("profile", "AuthController.update");
  Route.get("facebook/login", "AuthController.socialLogin");
  Route.get("facebook/authenticated", "AuthController.socialCallback");
}).prefix("auth");

Route.resource("users", "UserController")
  .middleware(new Map([[["update", "destroy"], ["auth"]]]))
  .validator(new Map([[["users.store"], ["StoreUser"]]]));

Route.resource("articles", "ArticleController")
  .validator(new Map([[["articles.store"], ["StoreArticle"]]]))
  .middleware(new Map([[["store", "update", "destroy"], ["auth"]]]));
