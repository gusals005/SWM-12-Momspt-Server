'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('body_types', [{
		name: 'RightUp',
		explanation : 'Right Up is not good.',
		pt_plan_id:1,
		createdAt:new Date(),
		updatedAt:new Date()
	}], {});
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('body_types', null, {});
  }
};
