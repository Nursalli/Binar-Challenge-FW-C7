'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User_game_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      time: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      room_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      opt_1: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM('R', 'S', 'P', '-'),
        defaultValue: '-'
      },
      opt_2: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM('R', 'S', 'P', '-'),
        defaultValue: '-'
      },
      opt_3: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM('R', 'S', 'P', '-'),
        defaultValue: '-'
      },
      result: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM('Win', 'Draw', 'Lose'),
        defaultValue: '-'
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User_game_histories');
  }
};