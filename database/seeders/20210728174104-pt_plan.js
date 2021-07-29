'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('pt_plans', [{
	id:1,
	  name: 'Fitsionary first pt_plan',
	  explanation:'It is our first pt plan!',
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
