'use strict';
const {
  Model
} = require('sequelize');
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