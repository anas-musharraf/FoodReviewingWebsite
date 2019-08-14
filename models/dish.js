const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Dish = mongoose.model('Dish', {
	_id: Schema.Types.ObjectId,
	name: String,
	price: Number,
	image: String,
	reviews: [{ type: Schema.Types.ObjectId, ref: 'DishReview'}],
	restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant'}
});

module.exports = { Dish };
