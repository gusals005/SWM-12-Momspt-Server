'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('pt_plans', [{
      name: 'first pt_plan',
	  explanation:'pt plan is pt plan!! pt plan!!',
	  body_type_id: 1,
	  createdAt:new Date(),
	  updatedAt:new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pt_plans',null,{});
	/**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
