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
			students_in_poverty: {
				type: Sequelize.BOOLEAN,
			},
			title_i_funded_school: {
				type: Sequelize.BOOLEAN,
			},
			selected_us_territory: {
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
