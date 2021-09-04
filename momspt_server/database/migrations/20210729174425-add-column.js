'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .addColumn(
        'users', // name of Target model
        'weightBeforePragnancy', // name of the key we're adding
        {
          type: Sequelize.FLOAT,
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
        'users', // name of the Target model
        'weightBeforePragnancy' // key we want to remove
      )
	/**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
