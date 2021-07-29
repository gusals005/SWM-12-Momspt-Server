'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('videos', [{
		name:'video first',
		playtime:15.33,
		explanation:'hi first video hi!',
		createdAt:new Date(),
        updatedAt:new Date()
			}], {});
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
