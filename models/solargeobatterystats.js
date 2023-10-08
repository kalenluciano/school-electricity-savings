'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class SolarGeoBatteryStats extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			SolarGeoBatteryStats.belongsTo(models.AddressGeosQualifications, {
				foreignKey: 'id',
			});
		}
	}
	SolarGeoBatteryStats.init(
		{
			total_tax_credit: DataTypes.INTEGER,
			base_credit: { type: DataTypes.INTEGER, defaultValue: 30 },
			additional_credit: DataTypes.INTEGER,
			low_income_status: DataTypes.BOOLEAN,
			census_tract_poverty_rate: DataTypes.FLOAT,
			census_tract_family_median_income: DataTypes.INTEGER,
			metro_area_family_median_income: DataTypes.INTEGER,
			state_family_median_income: DataTypes.INTEGER,
			indian_land_status: DataTypes.BOOLEAN,
			federal_american_indian_reservation: DataTypes.BOOLEAN,
			off_reservation_trust_land: DataTypes.BOOLEAN,
			alaska_native_village: DataTypes.BOOLEAN,
			majority_tribe_members: DataTypes.BOOLEAN,
			coal_mine_status: DataTypes.BOOLEAN,
			fossil_fuel_employment_status: DataTypes.BOOLEAN,
			msa_non_msa_name: DataTypes.STRING,
			msa_non_msa_unemployment_rate: DataTypes.FLOAT,
			brownfield_site_status: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'SolarGeoBatteryStats',
			tableName: 'solar_geo_battery_stats',
		}
	);
	return SolarGeoBatteryStats;
};
