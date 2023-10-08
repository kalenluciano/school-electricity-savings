'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('solar_geo_battery_stats', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			total_tax_credit: {
				type: Sequelize.INTEGER,
			},
			base_credit: {
				type: Sequelize.INTEGER,
				defaultValue: 30,
			},
			additional_credit: {
				type: Sequelize.INTEGER,
			},
			low_income_status: {
				type: Sequelize.BOOLEAN,
			},
			census_tract_poverty_rate: {
				type: Sequelize.FLOAT,
			},
			census_tract_family_median_income: {
				type: Sequelize.INTEGER,
			},
			metro_area_family_median_income: {
				type: Sequelize.INTEGER,
			},
			state_family_median_income: {
				type: Sequelize.INTEGER,
			},
			indian_land_status: {
				type: Sequelize.BOOLEAN,
			},
			federal_american_indian_reservation: {
				type: Sequelize.BOOLEAN,
			},
			off_reservation_trust_land: {
				type: Sequelize.BOOLEAN,
			},
			alaska_native_village: {
				type: Sequelize.BOOLEAN,
			},
			majority_tribe_members: {
				type: Sequelize.BOOLEAN,
			},
			coal_mine_status: {
				type: Sequelize.BOOLEAN,
			},
			fossil_fuel_employment_status: {
				type: Sequelize.BOOLEAN,
			},
			msa_non_msa_name: {
				type: Sequelize.STRING,
			},
			msa_non_msa_unemployment_rate: {
				type: Sequelize.FLOAT,
			},
			brownfield_site_status: {
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
		await queryInterface.dropTable('solar_geo_battery_stats');
	},
};
