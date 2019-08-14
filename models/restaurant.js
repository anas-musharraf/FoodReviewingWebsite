const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Restaurant = mongoose.model('Restaurant', {
	_id: Schema.Types.ObjectId,
	name: String,
	logo: String,
	followers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
	pricing: String,
	bannerImage: String,
	dishes: [{ type: Schema.Types.ObjectId, ref: 'Dish'}],
	reviews: [{ type: Schema.Types.ObjectId, ref: 'RestaurantReview'}],
	images: [String],
	aboutUs: String,
	businessHours: String,
	contact: {
		phone: String,
		email: String,
		location: String,
		twitter: String,
	}
});

module.exports = { Restaurant };
