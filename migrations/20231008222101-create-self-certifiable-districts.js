'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('self_certifiable_districts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			nces_id: {
				type: Sequelize.STRING,
			},
			district_name: {
				type: Sequelize.STRING,
			},
			city: {
				type: Sequelize.STRING,
			},
			state: {
				type: Sequelize.STRING,
			},
			region: {
				type: Sequelize.INTEGER,
			},
			district_in_saipe: {
				type: Sequelize.STRING,
			},
			large_district: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('self_certifiable_districts');
	},
};
