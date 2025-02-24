'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('electric_vehicle_stats', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			available_grants: {
				type: Sequelize.INTEGER,
			},
			poor_air_quality_area: {
				type: Sequelize.BOOLEAN,
			},
			high_need_school: {
				type: Sequelize.BOOLEAN,
			},
			rural_school: {
				type: Sequelize.BOOLEAN,
			},
			bureau_funded_school: {
				type: Sequelize.BOOLEAN,
			},
			school_with_children_on_indian_land: {
				type: Sequelize.BOOLEAN,
			},
			prioritized_clean_bus_school: {
				type: Sequelize.BOOLEAN,
			},
			self_certifiable_clean_bus_school: { type: Sequelize.BOOLEAN },
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
		await queryInterface.dropTable('electric_vehicle_stats');
	},
};
