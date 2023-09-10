'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class AddressGeosQualifications extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			AddressGeosQualifications.belongsTo(models.SolarGeoBatteryStats, {
				foreignKey: 'solar_geo_battery_id',
			});

			AddressGeosQualifications.belongsTo(models.ElectricVehicleStats, {
				foreignKey: 'electric_vehicles_id',
			});

			AddressGeosQualifications.belongsTo(models.EVChargerStats, {
				foreignKey: 'ev_chargers_id',
			});
		}
	}
	AddressGeosQualifications.init(
		{
			solar_geo_battery_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'SolarGeoBatteryStats',
					key: 'id',
				},
			},
			electric_vehicles_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'ElectricVehicleStats', // Update with the actual table name
					key: 'id',
				},
			},
			ev_chargers_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'EVChargerStats',
					key: 'id',
				},
			},
			street_address: DataTypes.STRING,
			street_address_2: DataTypes.STRING,
			city: DataTypes.STRING,
			state: DataTypes.STRING,
			zip_code: DataTypes.STRING,
			coordinates_lng: DataTypes.DOUBLE,
			coordinates_lat: DataTypes.DOUBLE,
			census_tract_geoid: DataTypes.STRING,
			census_tract_fips_code: DataTypes.STRING,
			county_fips_code: DataTypes.STRING,
			msa_cbsa_code: DataTypes.STRING,
			state_fips_code: DataTypes.STRING,
			tribal_census_tract_fips_code: DataTypes.STRING,
			tribal_census_block_fips_code: DataTypes.STRING,
			off_reservation_aiannh_code: DataTypes.STRING,
			reservation_aiannh_code: DataTypes.STRING,
			alaska_native_village_aiannh_code: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'AddressGeosQualifications',
			tableName: 'address_geos_qualifications',
		}
	);
	return AddressGeosQualifications;
};
