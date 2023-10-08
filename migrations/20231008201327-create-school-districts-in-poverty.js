'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('school_districts_in_poverty', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			state_postal_code: {
				type: Sequelize.STRING,
			},
			state_fips_code: {
				type: Sequelize.STRING,
			},
			district_id: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			estimated_5_to_17_population: {
				type: Sequelize.STRING,
			},
			estimated_5_to_17_poverty_population: {
				type: Sequelize.STRING,
			},
			poverty_rate: {
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
		await queryInterface.dropTable('school_districts_in_poverty');
	},
};
