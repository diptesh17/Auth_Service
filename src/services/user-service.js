const UserRepository = require("../repository/user-repository");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/serverConfig");
const bcrypt = require("bcrypt");
const AppErrors = require("../utils/error-handler");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw error;
      }

      console.log("Something went wrong in service layer");
      throw error;
    }
  }

  async signIn(email, plainPassword) {
    try {
      // fetch user
      const user = await this.userRepository.getbyEmail(email);
      // compare
      const passMatch = this.checkPassword(plainPassword, user.password);
      if (!passMatch) {
        console.log("Password doesn't match");
        throw { error: "Incorrect Password" };
      }

      // Pass match then new token
      const newJWT = this.createToken({
        email: user.email,
        id: user.id,
      });

      return newJWT;
    } catch (error) {
      console.log("Somwthing went wrong in sign in process");
      throw error;
    }
  }

  async isAuthenticated(token) {
    try {
      const response = this.verifyToken(token);
      if (!response) {
        throw { error: "Invalid Token" };
      }

      const user = await this.userRepository.getById(response.id);

      if (!user) {
        throw { error: "No user corresponsing to token exists" };
      }

      return user.id;
    } catch (error) {
      console.log("Somwthing went wrong in auth process");
      throw error;
    }
  }
  createToken(user) {
    try {
      const result = jwt.sign(user, JWT_KEY, { expiresIn: "1h" });
      return result;
    } catch (error) {
      console.log("Something went wrong in Token creation");
      throw error;
    }
  }

  verifyToken(token) {
    try {
      const response = jwt.verify(token, JWT_KEY);
      return response;
    } catch (error) {
      console.log("Something went wrong in Token Validation", error);
      throw error;
    }
  }

  checkPassword(userInputPlainPassword, encryptedPassword) {
    try {
      return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
    } catch (error) {
      console.log("Something went wrong in Password comparision");
      throw error;
    }
  }

  isAdmin(userId) {
    try {
      return this.userRepository.isAdmin(userId);
    } catch (error) {
      console.log("Something went wrong in service layer");
      throw error;
    }
  }
}
module.exports = UserService;
