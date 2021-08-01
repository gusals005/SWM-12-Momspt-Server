'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('pt_plan_exercise_mappings',[
	{
		pt_plan_id:1,
		exercise_id:1,
		exercise_date:'2021-07-29',
		exercise_order:1,
		createdAt:new Date(),
		updatedAt:new Date()
	},
	{
		pt_plan_id:1,
		exercise_id:2,
		exercise_date:'2021-07-29',
		exercise_order:2,
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{	
		pt_plan_id:1,
		exercise_id:3,
		exercise_date:'2021-07-29',
		exercise_order:3,
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{
		pt_plan_id:1,
		exercise_id:1,
		exercise_date:'2021-07-30',
		exercise_order:1,
		createdAt:new Date(),
		updatedAt:new Date()
	},
	{
		pt_plan_id:1,
		exercise_id:2,
		exercise_date:'2021-07-30',
		exercise_order:2,
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{	
		pt_plan_id:1,
		exercise_id:3,
		exercise_date:'2021-07-30',
		exercise_order:3,
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{
		pt_plan_id:1,
		exercise_id:1,
		exercise_date:'2021-07-31',
		exercise_order:1,
		createdAt:new Date(),
		updatedAt:new Date()
	},
	{
		pt_plan_id:1,
		exercise_id:2,
		exercise_date:'2021-07-31',
		exercise_order:2,
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{	
		pt_plan_id:1,
		exercise_id:3,
		exercise_date:'2021-07-31',
		exercise_order:3,
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
	await queryInterface.bulkDelete('pt_plan_exercise_mappings',null,{});
			/**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
