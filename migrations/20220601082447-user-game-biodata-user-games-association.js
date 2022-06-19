'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('User_game_biodata', {
      fields: ['id_user'],
      type: 'foreign key',
      name: 'user_game_biodata_user_games_association',
      references: {
        table: 'User_games',
        field: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('User_game_biodata', {
      fields: ['id_user'],
      type: 'foreign key',
      name: 'user_game_biodata_user_games_association',
      references: {
        table: 'User_games',
        field: 'id'
      }
    });
  }
};
