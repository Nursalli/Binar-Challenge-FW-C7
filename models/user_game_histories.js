'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_game_histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_game_histories.belongsTo(models.User_games, {
        foreignKey: 'id'
      });
    }
  }
  User_game_histories.init({
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    opt_1: {
      type: DataTypes.ENUM('R', 'S', 'P', '-'),
      allowNull: false,
      defaultValue: '-'
    },
    opt_2: {
      type: DataTypes.ENUM('R', 'S', 'P', '-'),
      allowNull: false,
      defaultValue: '-'
    },
    opt_3: {
      type: DataTypes.ENUM('R', 'S', 'P', '-'),
      allowNull: false,
      defaultValue: '-'
    },
    result: {
      type: DataTypes.ENUM('Win', 'Draw', 'Lose'),
      allowNull: false,
      defaultValue: '-'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User_game_histories',
  });
  return User_game_histories;
};