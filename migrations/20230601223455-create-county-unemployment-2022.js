'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('county_unemployment_2022', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			laus_code: {
				type: Sequelize.STRING
			},
			state_fips_code: {
				type: Sequelize.INTEGER
			},
			county_fips_code: {
				type: Sequelize.INTEGER
			},
			county_name_state_abbreviation: {
				type: Sequelize.STRING
			},
			year: {
				type: Sequelize.INTEGER
			},
			labor_force: {
				type: Sequelize.INTEGER
			},
			employed: {
				type: Sequelize.INTEGER
			},
			unemployed: {
				type: Sequelize.INTEGER
			},
			unemployment_rate: {
				type: Sequelize.FLOAT
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
		await queryInterface.dropTable('county_unemployment_2022');
	}
};
