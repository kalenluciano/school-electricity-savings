'use strict';

const fs = require('fs');
const csv = require('csv-parser');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData = [];

		return new Promise((resolve, reject) => {
			fs.createReadStream('data/disadvantaged_communities.csv')
				.pipe(csv())
				.on('data', (row) => {
					seedData.push({
						...row,
						createdAt: new Date(),
						updatedAt: new Date(),
					}); // Push each row of the CSV into the seedData array
				})
				.on('end', async () => {
					try {
						await queryInterface.bulkInsert(
							'disadvantaged_communities',
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
		queryInterface.bulkDelete('disadvantaged_communities');
	},
};
