'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pt_plan_exercise_mappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pt_plan_id: {
        type: Sequelize.INTEGER
      },
      exercise_id: {
        type: Sequelize.INTEGER
      },
      exercise_date: {
        type: Sequelize.DATE
      },
      exercise_order: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pt_plan_exercise_mappings');
  }
};