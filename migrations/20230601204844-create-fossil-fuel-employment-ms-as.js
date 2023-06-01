'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('fossil_fuel_employment_msas', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			state_fips_code: {
				type: Sequelize.INTEGER
			},
			county_fips_code: {
				type: Sequelize.INTEGER
			},
			state_name: {
				type: Sequelize.STRING
			},
			county_entity_name: {
				type: Sequelize.STRING
			},
			msa_non_msa_code: {
				type: Sequelize.INTEGER
			},
			msa_non_msa_name: {
				type: Sequelize.STRING
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
		await queryInterface.dropTable('fossil_fuel_employment_msas');
	}
};
