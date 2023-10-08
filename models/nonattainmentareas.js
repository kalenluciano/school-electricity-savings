'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class NonattainmentAreas extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	NonattainmentAreas.init(
		{
			state: DataTypes.STRING,
			st_abbr: DataTypes.STRING,
			countyname: DataTypes.STRING,
			pollutant: DataTypes.STRING,
			revoked_naaqs: DataTypes.STRING,
			area_name: DataTypes.STRING,
			split: DataTypes.BOOLEAN,
			yr2021: DataTypes.STRING,
			yr2022: DataTypes.STRING,
			yr2023: DataTypes.STRING,
			effec_rede: DataTypes.STRING,
			nonattain: DataTypes.STRING,
			class: DataTypes.STRING,
			part: DataTypes.STRING,
			population: DataTypes.STRING,
			fips_state: DataTypes.STRING,
			fips_cnty: DataTypes.STRING,
			pollorder: DataTypes.STRING,
			composid: DataTypes.STRING,
			exportdt: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'NonattainmentAreas',
			tableName: 'nonattainment_areas',
		}
	);
	return NonattainmentAreas;
};
