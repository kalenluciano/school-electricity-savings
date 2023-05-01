'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('variables', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			zip_code: {
				type: Sequelize.INTEGER
			},
			low_income: {
				type: Sequelize.BOOLEAN
			},
			native_land: {
				type: Sequelize.BOOLEAN
			},
			energy_community: {
				type: Sequelize.BOOLEAN
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
		await queryInterface.dropTable('variables');
	}
};
