'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .addColumn(
        'exercises', // name of Target model
        'thumbnail', // name of the key we're adding
        {
          type: Sequelize.STRING,
          // setting foreign key relationship
        }
      )
	/**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    
	return queryInterface
      .removeColumn(
        'exercises', // name of the Target model
        'thumbnail' // key we want to remove
      )
	/**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
