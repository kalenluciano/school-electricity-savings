const { Saving } = require('../models');

const GetSavingsBaseline = async (req, res, next) => {
	const allSavings = await Saving.findAll({
		include: [
			{ model: Saving, as: 'main_savings', through: { attributes: [] } }
		]
	});

	allSavings.forEach((savings) => {
		savings.main_savings.forEach((savingsObj) => {
			const index = allSavings.findIndex(
				(item) => item.id === savingsObj.id
			);
			if (index !== -1) {
				allSavings.splice(index, 1);
			}
		});
	});

	res.send(allSavings);
};

module.exports = {
	GetSavingsBaseline
};
