'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users',[
      {
		id:1,
		name: 'fit',
        baby_birthday: '2021-07-22',
		pt_plan_id:1,
		body_type_id:1,
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
