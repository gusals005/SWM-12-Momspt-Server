'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exercises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      explanation: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING
      },
      video_id: {
        type: Sequelize.INTEGER
      },
      calorie: {
        type: Sequelize.FLOAT
      },
      playtime: {
        type: Sequelize.FLOAT
      },
      effect: {
        type: Sequelize.TEXT
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('exercises');
  }
};