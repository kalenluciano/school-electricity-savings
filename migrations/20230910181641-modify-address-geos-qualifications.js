'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Add foreign key constraints to the existing columns
		await queryInterface.changeColumn(
			'address_geos_qualifications',
			'solar_geo_battery_id',
			{
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'solar_geo_battery_stats',
					key: 'id',
				},
			}
		);

		await queryInterface.changeColumn(
			'address_geos_qualifications',
			'electric_vehicles_id',
			{
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'electric_vehicle_stats',
					key: 'id',
				},
			}
		);

		await queryInterface.changeColumn(
			'address_geos_qualifications',
			'ev_chargers_id',
			{
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'ev_charger_stats',
					key: 'id',
				},
			}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn(
			'address_geos_qualifications',
			'solar_geo_battery_id',
			{
				type: Sequelize.INTEGER,
			}
		);

		await queryInterface.changeColumn(
			'address_geos_qualifications',
			'electric_vehicles_id',
			{
				type: Sequelize.INTEGER,
			}
		);

		await queryInterface.changeColumn(
			'address_geos_qualifications',
			'ev_chargers_id',
			{
				type: Sequelize.INTEGER,
			}
		);
	},
};
