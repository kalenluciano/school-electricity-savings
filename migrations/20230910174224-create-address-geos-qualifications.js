'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('address_geos_qualifications', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			solar_geo_battery_id: {
				type: Sequelize.INTEGER,
			},
			electric_vehicles_id: {
				type: Sequelize.INTEGER,
			},
			ev_chargers_id: {
				type: Sequelize.INTEGER,
			},
			street_address: {
				type: Sequelize.STRING,
			},
			street_address_2: {
				type: Sequelize.STRING,
			},
			city: {
				type: Sequelize.STRING,
			},
			state: {
				type: Sequelize.STRING,
			},
			zip_code: {
				type: Sequelize.STRING,
			},
			coordinates_lng: {
				type: Sequelize.DOUBLE,
			},
			coordinates_lat: {
				type: Sequelize.DOUBLE,
			},
			census_tract_geoid: {
				type: Sequelize.STRING,
			},
			census_tract_fips_code: {
				type: Sequelize.STRING,
			},
			county_fips_code: {
				type: Sequelize.STRING,
			},
			msa_cbsa_code: {
				type: Sequelize.STRING,
			},
			state_fips_code: {
				type: Sequelize.STRING,
			},
			tribal_census_tract_fips_code: {
				type: Sequelize.STRING,
			},
			tribal_census_block_fips_code: {
				type: Sequelize.STRING,
			},
			off_reservation_aiannh_code: {
				type: Sequelize.STRING,
			},
			reservation_aiannh_code: {
				type: Sequelize.STRING,
			},
			alaska_native_village_aiannh_code: {
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
		await queryInterface.dropTable('address_geos_qualifications');
	},
};
