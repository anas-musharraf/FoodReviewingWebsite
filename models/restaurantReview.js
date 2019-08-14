const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantReview = mongoose.model('RestaurantReview', {
	_id: Schema.Types.ObjectId,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	restaurant: {
		type: Schema.Types.ObjectId,
		ref: 'Restaurant'
	},
	comment: String,
	rating: Number,
	date: Date,
});

module.exports = { RestaurantReview };
