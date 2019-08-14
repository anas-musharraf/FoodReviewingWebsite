const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DishReview = mongoose.model('DishReview', {
	_id: Schema.Types.ObjectId,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	dish: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish',
	},
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant',
	},
	comment: String,
	rating: Number,
	date: Date,
});


module.exports = { DishReview };
