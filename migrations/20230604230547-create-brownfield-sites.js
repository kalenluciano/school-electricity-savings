'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('brownfield_sites', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			cleanup_name: {
				type: Sequelize.STRING
			},
			location_address: {
				type: Sequelize.STRING
			},
			city_name: {
				type: Sequelize.STRING
			},
			state_code: {
				type: Sequelize.STRING
			},
			postal_code: {
				type: Sequelize.STRING
			},
			county_name: {
				type: Sequelize.STRING
			},
			epa_id: {
				type: Sequelize.STRING
			},
			latitude: {
				allowNull: true,
				type: Sequelize.DOUBLE
			},
			longitude: {
				allowNull: true,
				type: Sequelize.DOUBLE
			},
			epa_region_code: {
				type: Sequelize.STRING
			},
			tribal_land: {
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
		await queryInterface.dropTable('brownfield_sites');
	}
};
