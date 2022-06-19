'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('User_games', [
       {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        user_token: null,
        role: 'Super User',
        createdAt: new Date(),
        updatedAt: new Date()
       },
       {
        username: 'muhammad',
        password: bcrypt.hashSync('muhammad123', 10),
        user_token: null,
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
       },
       {
        username: 'nur',
        password: bcrypt.hashSync('nur123', 10),
        user_token: null,
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
       },
       {
        username: 'sali',
        password: bcrypt.hashSync('sali123', 10),
        user_token: null,
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
       },
    ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('User_games', null, {});
  }
};
