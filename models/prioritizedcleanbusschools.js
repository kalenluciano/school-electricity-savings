'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PrioritizedCleanBusSchools extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	PrioritizedCleanBusSchools.init(
		{
			nces_id: DataTypes.STRING,
			district_name: DataTypes.STRING,
			city: DataTypes.STRING,
			state: DataTypes.STRING,
			region: DataTypes.STRING,
			high_need: DataTypes.STRING,
			rural: DataTypes.STRING,
			school_with_children_on_indian_land: DataTypes.STRING,
			bureau_funded_schools: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'PrioritizedCleanBusSchools',
			tableName: 'prioritized_clean_bus_schools',
		}
	);
	return PrioritizedCleanBusSchools;
};
