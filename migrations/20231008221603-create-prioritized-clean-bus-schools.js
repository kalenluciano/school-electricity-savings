'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('prioritized_clean_bus_schools', {
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
				type: Sequelize.STRING,
			},
			high_need: {
				type: Sequelize.STRING,
			},
			rural: {
				type: Sequelize.STRING,
			},
			school_with_children_on_indian_land: {
				type: Sequelize.STRING,
			},
			bureau_funded_schools: {
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
		await queryInterface.dropTable('prioritized_clean_bus_schools');
	},
};
