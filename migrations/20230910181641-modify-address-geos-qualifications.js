'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Add foreign key constraints to the existing columns
		await queryInterface.changeColumn(
			'AddressGeosQualifications',
			'solar_geo_battery_id',
			{
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'SolarGeoBatteryStats',
					key: 'id',
				},
			}
		);

		await queryInterface.changeColumn(
			'AddressGeosQualifications',
			'electric_vehicles_id',
			{
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'ElectricVehicleStats',
					key: 'id',
				},
			}
		);

		await queryInterface.changeColumn(
			'AddressGeosQualifications',
			'ev_chargers_id',
			{
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'EVChargerStats',
					key: 'id',
				},
			}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn(
			'AddressGeosQualifications',
			'solar_geo_battery_id',
			{
				type: Sequelize.INTEGER,
			}
		);

		await queryInterface.changeColumn(
			'AddressGeosQualifications',
			'electric_vehicles_id',
			{
				type: Sequelize.INTEGER,
			}
		);

		await queryInterface.changeColumn(
			'AddressGeosQualifications',
			'ev_chargers_id',
			{
				type: Sequelize.INTEGER,
			}
		);
	},
};
