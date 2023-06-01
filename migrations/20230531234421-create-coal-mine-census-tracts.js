'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('coal_mine_census_tracts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			state_name: {
				type: Sequelize.STRING
			},
			county_entity_name: {
				type: Sequelize.STRING
			},
			census_tract_2020_number_fips_code: {
				type: Sequelize.STRING
			},
			tract_type: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('coal_mine_census_tracts');
	}
};
