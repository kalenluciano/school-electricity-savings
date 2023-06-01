'use strict';

const fs = require('fs');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream(
				'/Users/kalenluciano/coding_projects/out_in_tech/school-electricity-savings-backend/data/coal_mine_census_tracts.csv'
			)
				.pipe(csv())
				.on('data', (row) => {
					seedData.push(row); // Push each row of the CSV into the seedData array
				})
				.on('end', async () => {
					try {
						await queryInterface.bulkInsert(
							'coal_mine_census_tracts',
							seedData,
							{}
						);
						resolve();
					} catch (error) {
						reject(error);
					}
				});
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.bulkDelete('coal_mine_census_tracts.csv');
	}
};
