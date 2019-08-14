const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: Schema.Types.ObjectId, 
	name: String,
	userID: String,
	image: String,
	location: String,
	phoneNum: String,
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minLength: 6
	},
	aboutMe: String,
	role: String,
	restaurantReviews: [{ type: Schema.Types.ObjectId, ref: 'RestaurantReview' }],
	dishReviews: [{ type: Schema.Types.ObjectId, ref: 'DishReview'}],
	restaurantsFollowing: [{ type: Schema.Types.ObjectId, ref: 'Restaurant'}],
	following: [{ type: Schema.Types.ObjectId, ref: 'User'}],
	followers: [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}
});

// Our own student finding function
UserSchema.statics.findByEmailPassword = function(email, password) {
	const User = this

	return User.findOne({email: email}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			});
		})
	})
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };
