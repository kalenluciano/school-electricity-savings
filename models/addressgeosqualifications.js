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
			// define association here
		}
	}
	AddressGeosQualifications.init(
		{
			solar_geo_battery_id: DataTypes.INTEGER,
			electric_vehicles_id: DataTypes.INTEGER,
			ev_chargers_id: DataTypes.INTEGER,
			street_address: DataTypes.STRING,
			street_address_2: DataTypes.STRING,
			city: DataTypes.STRING,
			state: DataTypes.STRING,
			zip_code: DataTypes.INTEGER,
			coordinates_lng: DataTypes.DOUBLE,
			coordinates_lat: DataTypes.DOUBLE,
			census_tract_geoid: DataTypes.INTEGER,
			census_tract_fips_code: DataTypes.INTEGER,
			county_fips_code: DataTypes.INTEGER,
			msa_cbsa_code: DataTypes.INTEGER,
			state_fips_code: DataTypes.STRING,
			tribal_census_tract_fips_code: DataTypes.STRING,
			tribal_census_block_fips_code: DataTypes.STRING,
			off_reservation_aiannh_code: DataTypes.INTEGER,
			reservation_aiannh_code: DataTypes.INTEGER,
			alaska_native_village_aiannh_code: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'AddressGeosQualifications',
			tableName: 'address_geos_qualifications',
		}
	);
	return AddressGeosQualifications;
};
