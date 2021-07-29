'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('exercises',[{
		name: 'first exercise',
		explanation: 'good at arm',
		type:'arm exercise',
		video_id:1,
		calorie:433,
		playtime:15.33,
		effect:'good good good at arm',
		createdAt:new Date(),
        updatedAt:new Date()
			}],{});
		  /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
	await queryInterface.bulkDelete('exercises',null,{});
			/**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
