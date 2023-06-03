'use strict';

const fs = require('fs');
const csv = require('csv-parser');
const { CountyUnemployment2022 } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream('data/fossil_fuel_employment_msas.csv')
				.pipe(csv())
				.on('data', (row) => {
					seedData.push({
						...row,
						createdAt: new Date(),
						updatedAt: new Date()
					}); // Push each row of the CSV into the seedData array
				})
				.on('end', async () => {
					try {
						const msaUnemployment = {};
						return new Promise(async (resolve, reject) => {
							try {
								for (let i = 0; i < seedData.length; i++) {
									let countyObject = seedData[i];
									if (
										!msaUnemployment[
											countyObject.msa_non_msa_code
										]
									) {
										msaUnemployment[
											countyObject.msa_non_msa_code
										] = {
											laborForce2022: 0,
											unemployed2022: 0,
											msa_unemployment: true
										};
									}
									const countyData2022 =
										await CountyUnemployment2022.findOne({
											where: {
												state_fips_code:
													countyObject.state_fips_code,
												county_fips_code:
													countyObject.county_fips_code
											},
											raw: true
										});
									if (countyData2022) {
										msaUnemployment[
											countyObject.msa_non_msa_code
										]['laborForce2022'] +=
											countyData2022.labor_force;
										msaUnemployment[
											countyObject.msa_non_msa_code
										]['unemployed2022'] +=
											countyData2022.unemployed;
									}
								}
								resolve();
							} catch (error) {
								reject(error);
							}
						})
							.then(async () => {
								const nationalAverageUnemployment = 5.8;
								for (const msaCode in msaUnemployment) {
									if (
										parseInt(
											msaUnemployment[msaCode]
												.unemployed2022
										) /
											parseInt(
												msaUnemployment[msaCode]
													.laborForce2022
											) >
										nationalAverageUnemployment
									) {
										msaUnemployment[
											msaCode
										].msa_unemployment = true;
									} else {
										msaUnemployment[
											msaCode
										].msa_unemployment = false;
									}
								}
								resolve();
							})
							.then(async () => {
								for (let i = 0; i < seedData.length; i++) {
									seedData[i].msa_unemployment =
										msaUnemployment[
											seedData[i].msa_non_msa_code
										].msa_unemployment;
								}
								resolve();
							})
							.then(async () => {
								await queryInterface.bulkInsert(
									'fossil_fuel_employment_msas',
									seedData,
									{}
								);
								resolve();
							});
					} catch (error) {
						reject(error);
					}
				});
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.bulkDelete('fossil_fuel_employment_msas');
	}
};
