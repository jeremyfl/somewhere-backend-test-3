"use strict";
const User = use("App/Models/User");

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
