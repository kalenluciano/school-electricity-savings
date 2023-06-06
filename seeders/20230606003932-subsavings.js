'use strict';

const { Savings } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const savingsAndSubSavings = [];

		let batteryStorage = await Savings.findOne({
			where: { item: 'Battery Storage Installation' }
		});
		let geothermalHeating = await Savings.findOne({
			where: { item: 'Geothermal Heating Installation' }
		});
		let solarPanel = await Savings.findOne({
			where: { item: 'Solar Panel Installation' }
		});
		const mainSavings = [batteryStorage, geothermalHeating, solarPanel];

		let usMaterialBonus = await Savings.findOne({
			where: { item: 'US Material Bonus' }
		});
		let lowIncomeIndianLandBonus = await Savings.findOne({
			where: { item: 'Low-Income or Indian Land Bonus' }
		});
		let energyCommunityBonus = await Savings.findOne({
			where: { item: 'Energy Community Bonus' }
		});
		const subSavings = [
			usMaterialBonus,
			lowIncomeIndianLandBonus,
			energyCommunityBonus
		];

		for (let item of mainSavings) {
			for (let subItem of subSavings) {
				savingsAndSubSavings.push({
					main_savings_id: item.id,
					sub_savings_id: subItem.id
				});
			}
		}

		await queryInterface.bulkInsert(
			'sub_savings',
			savingsAndSubSavings,
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('sub_savings');
	}
};
