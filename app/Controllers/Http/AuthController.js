"use strict";
const User = use("App/Models/User");
const UserProfile = use("App/Models/UserProfile");
const Helpers = use("Helpers");

class AuthController {
  async login({ auth, request, response }) {
    const { email, password } = request.only(["email", "password"]);

    try {
      await auth.attempt(email, password);
    } catch (error) {
      return response.status(401).send({
        status: 401,
        message: "Password salah",
        data: error
      });
    }

    let user = await User.query()
      .where("email", email)
      .with("profile")
      .firstOrFail();

    user = user.toJSON();

    return response.status(200).send({
      status: 200,
      message: "Login success",
      data: await auth.generate(user, {
        email: user.email,
        full_name: user.profile.full_name,
        address: user.profile.address,
        photo_url: user.profile.photo_url
      })
    });
  }

  async update({ auth, params, request, response }) {
    const userData = auth.user;

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

    const user = await User.query()
      .where("id", userData.id)
      .update({ email: payload.email, password: payload.password });

    await UserProfile.query()
      .where("user_id", userData.id)
      .update({
        user_id: user.id,
        full_name: payload.full_name,
        address: payload.address,
        photo_url: payload.photo_url
      });

    return response.status(201).send({
      status: 201,
      message: "Record updated"
    });
  }

  async socialLogin({ ally }) {
    await ally.driver("facebook").redirect();
  }

  async socialCallback({ auth, ally, response }) {
    try {
      const fbUser = await ally.driver("facebook").getUser();

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: "facebook"
      };

      // TODO:: Remove until it live
      return response.send({
        data: userDetails
      });

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      };

      const user = await User.findOrCreate(whereClause, userDetails);
      await auth.login(user);

      return "Logged in";
    } catch (error) {
      return "Unable to authenticate. Try again later";
    }
  }
}

module.exports = AuthController;
