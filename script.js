'use strict'

const { mongoose } = require('./db/mongoose');

const { Dish } = require('./models/dish');
const { Restaurant } = require('./models/restaurant');
const { DishReview } = require('./models/dishReview');
const { RestaurantReview } = require('./models/restaurantReview');
const { User } = require('./models/user');

const fs = require('fs');


function populateRestaurantsAndDishes() {
	const restaurants = JSON.parse(fs.readFileSync('restaurant.json'));

	for(let i = 0; i < restaurants.length; i++) {
		const restaurant = restaurants[i];
		const dishes = restaurant.dishes;

		let newRestaurant = new Restaurant({
			_id: mongoose.Types.ObjectId(),
			name: restaurant.name,
			pricing: restaurant.pricing,
			bannerImage: restaurant.bannerImage.trim(),
			images: restaurant.images,
			aboutUs: restaurant.aboutUs,
			businessHours: restaurant.businessHours,
			contact: restaurant.contact,
			dishes: []
		});

		for(let j = 0; j < dishes.length; j++) {
			const dish = dishes[j];

			let newDish = new Dish({
				_id: mongoose.Types.ObjectId(),
				name: dish.name,
				price: dish.price,
				image: dish.image.trim(),
				restaurant: newRestaurant._id
			});


			newRestaurant.dishes.push(newDish._id);

			newDish.save().then((dish) => {
				console.log(`Dish ${dish.name} saved!`);
			}, (error) => {
				console.log(error);
			});
		}

		newRestaurant.save().then((rest) => {
			console.log(`Restaurant ${rest.name} saved!`);
		}, (error) => {
			console.log(error);
		});
	}
}

function populateFoodReviewsOnDexter() {

	let newDishReview = new DishReview({
		_id: mongoose.Types.ObjectId(),
		user: "5c062988b18efa30703ae6f7",
		dish: "5c061446718bbe2f5350a08a",
		restaurant: "5c061446718bbe2f5350a082",
		comment: "ki mo chi <3",
		rating: 5,
		date: new Date("November 12, 2018")
	});

	User.findById(newDishReview.user).then((user) => {
		if (!user) { // restaurant not found
			res.status(404).send()
		} else {
			user.dishReviews.push(newDishReview._id)
			user.save().then(() => {
				console.log(`DishReview saved!`);
			}, (error) => {
				console.log(error);
			});
		}
	}).catch((error) => {
		res.status(500).send(error)
	});

	newDishReview.save().then(() => {
		console.log(`Dish Review saved! 2`);
	}, (error) => {
		console.log(error);
	});

}

function populateRestaruantReviewsOnDexter() {

	let newRestaurantReview = new RestaurantReview({
		_id: mongoose.Types.ObjectId(),
		user: "5c062988b18efa30703ae6f7",
		restaurant: "5c061446718bbe2f5350a082",
		comment: "I thought fast food was suppose to be cheap. Like I shouldn\"t be spending more than $10-12 on a meal. But I always go over $15.",
		rating: 2,
		date: new Date("November 5, 2018")
	});

	User.findById(newRestaurantReview.user).then((user) => {
		if (!user) { // restaurant not found
			res.status(404).send()
		} else {
			user.RestaurantReview.push(newRestaurantReview._id)
			user.save().then(() => {
				console.log(`RestaurantReview saved!`);
			}, (error) => {
				console.log(error);
			});
		}
	}).catch((error) => {
		res.status(500).send(error)
	});

	newRestaurantReview.save().then(() => {
		console.log(`Dish Review saved! 2`);
	}, (error) => {
		console.log(error);
	});

}

function populateUser() {
	let newUser = new User({
		_id: mongoose.Types.ObjectId(),
		name: 'Gavin Ding',
		userID: 'gavinKing101',
		image: 'images/user3.jpg',
		location: 'Toronto, Ontario, Canada',
		phoneNum: '647-122-9911',
		email: 'gavin.ding@mail.utoronto.ca',
		password: 'password',
		aboutMe: 'I like shooting animals with my bow and arrows.',
		role: 'user'
	});

	newUser.save().then((user) => {
		console.log(user);
	}, (error) => {
		console.log(error);
	});
}
function populateUser2() {
	let newUser = new User({
		_id: mongoose.Types.ObjectId(),
		name: 'Anas Musharras',
		userID: 'anasSus',
		image: 'images/user4.jpg',
		location: 'Toronto, Ontario, Canada',
		phoneNum: '647-444-2323',
		email: 'anas.@mail.utoronto.ca',
		password: 'password',
		aboutMe: 'Canada Numba One.',
		role: 'user'
	});

	newUser.save().then((user) => {
		console.log(user);
	}, (error) => {
		console.log(error);
	});
}

populateRestaruantReviewsOnDexter();
