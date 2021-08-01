'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('videos', [
		{
			id:1,
			name:'hipbridge',
			playtime:114,
			explanation:'hipbridge video',
			createdAt:new Date(),
			updatedAt:new Date()
		},
		{
			id:2,
			name:'uparmleg',
			playtime:99,
			explanation:'uparmleg video',
			createdAt:new Date(),
			updatedAt:new Date()
		},
		{
			id:3,
			name:'tabata',
			playtime:59,
			explanation:'tabata video',
			createdAt:new Date(),
			updatedAt:new Date()
		}
	], {});
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
	await queryInterface.bulkDelete('videos',null,{});
			/**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
