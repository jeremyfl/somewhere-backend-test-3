"use strict";
const User = use("App/Models/User");
const UserProfile = use("App/Models/UserProfile");
const Helpers = use("Helpers");

class UserController {
  async index({ response }) {
    const users = await User.query()
      .with("profile")
      .fetch();

    return response.send({
      status: 200,
      data: users
    });
  }

  async store({ request, response }) {
    const payload = request.only([
      "email",
      "username",
      "full_name",
      "address",
      "password"
    ]);

    const user = await User.create({
      email: payload.email,
      username: payload.username,
      password: payload.password
    });

    const profilePic = request.file("profile_pic", {
      types: ["image"],
      size: "2mb"
    });

    await profilePic.move(Helpers.publicPath("uploads"), {
      name: profilePic.clientName,
      overwrite: true
    });

    if (!profilePic.moved()) {
      return profilePic.error();
    }

    const profile = await UserProfile.create({
      user_id: user.id,
      full_name: payload.full_name,
      address: payload.address,
      photo_url: `uploads/${profilePic.fileName}`
    });

    return response.send({
      status: 200,
      data: {
        user: user,
        profile: profile
      }
    });
  }

  async show({ params, response }) {
    const users = await User.query()
      .where("id", params.id)
      .with("profile")
      .firstOrFail();

    return response.send({
      status: 200,
      data: users
    });
  }

  async update({ params, request, response }) {
    const payload = request.only([
      "email",
      "username",
      "full_name",
      "address",
      "password"
    ]);

    const profilePic = request.file("profile_pic", {
      types: ["image"],
      size: "2mb"
    });

    if (profilePic) {
      await profilePic.move(Helpers.publicPath("uploads"), {
        name: profilePic.clientName,
        overwrite: true
      });

      if (!profilePic.moved()) {
        return profilePic.error();
      }

      payload.photo_url = `uploads/${profilePic.fileName}`;
    }

    await User.query()
      .where("id", params.id)
      .update({ email: payload.email, password: payload.password });

    await UserProfile.query()
      .where("id", params.id)
      .update({
        full_name: payload.full_name,
        address: payload.address,
        photo_url: payload.photo_url
      });

    return response.status(201).send({
      status: 201,
      message: "Record updated"
    });
  }

  async destroy({ params, response }) {
    const user = await User.findOrFail(params.id);

    await user.delete();

    return response.status(201).send({
      status: 200,
      message: "Record deleted"
    });
  }
}

module.exports = UserController;
