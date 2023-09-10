'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ElectricVehicleStats extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	ElectricVehicleStats.init(
		{
			available_grants: DataTypes.INTEGER,
			poor_air_quality_area: DataTypes.BOOLEAN,
			high_need_school: DataTypes.BOOLEAN,
			students_in_poverty: DataTypes.BOOLEAN,
			title_i_funded_school: DataTypes.BOOLEAN,
			selected_us_territory: DataTypes.BOOLEAN,
			rural_school: DataTypes.BOOLEAN,
			bureau_funded_school: DataTypes.BOOLEAN,
			school_with_children_on_indian_land: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'ElectricVehicleStats',
			tableName: 'electric_vehicle_stats',
		}
	);
	return ElectricVehicleStats;
};
