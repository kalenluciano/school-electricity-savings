'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('savings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			item: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			},
			amount: {
				type: Sequelize.INTEGER
			},
			qualifications: {
				type: Sequelize.ARRAY(Sequelize.TEXT)
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('savings');
	}
};
