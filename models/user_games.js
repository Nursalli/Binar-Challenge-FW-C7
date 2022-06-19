'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User_games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_games.hasMany(models.User_game_histories, {
        foreignKey: 'id_user'
      });
      User_games.hasOne(models.User_game_biodata, {
        foreignKey: 'id_user'
      });
    }

    // Method untuk melakukan enkripsi
    static #encrypt = (password) => {
      return bcrypt.hashSync(password, 10);
    }

    static register = ({username, password}) => {
      const encryptedPassword = this.#encrypt(password);

      return this.create({ 
        username, 
        password: encryptedPassword 
      });
    }

    static updateData = (newData, id) => {
      return this.update(newData, {
        where: {
          id
        }
      });
    }

    static authenticate = async ({ username, password }) => {
      try {
        const user = await this.findOne({ 
          where: { 
            username 
          }
        });

        const checkPassword = bcrypt.compareSync(password, user.password);
        const checkSuperUser = (user.role === 'Super User') ? true : false;

        if (!user || !checkSuperUser) {
          return Promise.reject("Wrong Username/Password!")
        }

        if (!checkPassword) {
          return Promise.reject("Wrong Username/Password!")
        }

        return Promise.resolve(user)
      }
      catch(err) {
        return Promise.reject(err)
      }  
    }
  }
  User_games.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_token: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM('Super User', 'User'),
      allowNull: false,
      defaultValue: 'User'
    }
  }, {
    sequelize,
    modelName: 'User_games',
  });
  return User_games;
};