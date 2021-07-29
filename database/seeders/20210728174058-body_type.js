'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('body_types', [{
		id:1,
		name: 'RightUp',
		explanation : '오른쪽 골반이 조금 올라가 있습니다.',
		pt_plan_id:1,
		createdAt:new Date(),
		updatedAt:new Date()
	}], {});
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('body_types', null, {});
  }
};
