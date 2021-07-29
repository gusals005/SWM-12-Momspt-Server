'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users',[
      {
        name: 'HI test',
        baby_birthday: '2021-07-29',
        createdAt: new Date(),	
        updatedAt: new Date(),
      },
    ]);
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
	await queryInterface.bulkDelete('users',null,{}); 
			
	/**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
