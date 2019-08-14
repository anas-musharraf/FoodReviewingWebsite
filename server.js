//random change
'use strict';

const express = require('express');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const session = require('express-session');

// Import mongoose connection
const { mongoose } = require('./db/mongoose');

const { Restaurant } = require('./models/restaurant');
const { Dish } = require('./models/dish');
const { User } = require('./models/user');
const { RestaurantReview } = require('./models/restaurantReview');
const { DishReview } = require('./models/dishReview')

// load express
const app = express();

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 86400000,
		httpOnly: true
	}
}));

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/controllers'));
app.use(express.static(__dirname + '/images'));

app.use(bodyParser.json());

// get Routes
app.get('/', (req, res) => {
	res.status(200).sendFile('index.html');
});

app.get('/restaurants/:rid', (req, res) => {
	res.status(200).sendFile(__dirname + '/restaurant.html');
});

app.get('/restaurants/search/:query', (req, res) => {
	const query = req.params.query;

	console.log(query);

	Restaurant
		.find({'name': {$regex: query, $options: "i"}})
		.populate('reviews')
		.exec((error, restaurants) => {
			res.send(restaurants);
		});
});

app.get('/dishes/search/:query', (req, res) => {
	const query = req.params.query;

	console.log(query);

	Dish
		.find({'name': {$regex: query, $options: "i"}})
		.populate('reviews')
		.exec((error, dishes) => {
			console.log(dishes);
			res.send(dishes);
		});
});

app.get('/restaurants/api/:rid', (req, res) => {
	const rid = req.params.rid;;

	Restaurant
		.findOne({_id: rid})
		.populate({
			path: 'dishes',
			populate: {path: 'reviews'}
		})
		// populating 2 levels deep
		.populate({
			path: 'reviews',
			populate: {path: 'user'}
		})
		.exec((error, restaurant) => {
			res.send(restaurant);
		});
});

app.get('/users/:id', (req, res) => {
	res.status(200).sendFile(__dirname + '/user.html');
});

app.get('/users/api/:id', (req, res) => {
	const id = req.params.id;

	User
		.findOne({_id: id})
		.populate({
			path: 'restaurantReviews',
			populate: {path: 'restaurant'}
		})
		.populate({
			path: 'dishReviews',
			populate: {path: 'dish'}
		})
		.populate({
			path: 'dishReviews',
			populate: {path: 'restaurant'}
		})
		.populate('restaurantsFollowing')
		.populate('following')
		.populate('followers')
		.exec((error, user) => {
			console.log(user);
			res.send(user);
		});
});

app.get('/dishes/:name', (req, res) => {
	res.status(200).sendFile(__dirname + '/dish.html');
});

app.get('/dishes/api/:id', (req, res) => {
	const id = req.params.id;

	Dish
		.findOne({_id: id})
		.populate({
			path: 'reviews',
			populate: {path: 'user'}
		})
		.exec((error, dishes) => {
			res.send(dishes);
		});
});


app.get('/currentuser', (req, res) => {
	if (req.session.user) {
		// if we are able to find the logged in user in user database
		User.findOne({_id: req.session.user}).then((user) => {
			res.json({loggedIn: true, user: user});
		});
	} else {
		res.json({loggedIn: false});
	}
});

app.get('/admin', (req, res) => {
	if (req.session.user) {
		User.findOne({_id: req.session.user}).then((user) => {
			if (user && user.role === 'Admin') {
				res.status(200).sendFile(__dirname + '/admin.html');
			} else {
				res.status(403).send('<p>Forbidden Resource</p>');
			}
		});
	} else {
		res.status(403).send('<p>Forbidden Resource</p>');
	}
});

app.get('/login', (req, res) => {
	res.status(200).sendFile(__dirname + '/login.html');
});

app.get('/signup', (req, res) => {
	res.status(200).sendFile(__dirname + '/signup.html');
});

app.get('/signup/users', (req, res) => {
	User.find().then((users) => {
		res.send(users);
	}, (error) => {
		res.status(500).send(error);
	})
});

app.get('/admin/users', (req, res) => {
	User.find().then((users) => {
		res.send(users);
	}, (error) => {
		res.status(500).send(error);
	})
});

app.get('/admin/restaurants', (req, res) => {
	Restaurant.find().then((restaurants) => {
		res.send(restaurants);
	}, (error) => {
		res.status(500).send(error);
	})
});

app.get('/dishes', (req, res) => {
	res.status(200).sendFile(__dirname + '/dish.html');
});

app.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findByEmailPassword(email, password)
		.then((user) => {
			if(!user) {
				res.json({invalidLogin: true});
			} else {
				// Add the user to the session cookie that we will
				// send to the client
				req.session.user = user._id;
				res.json({invalidLogin: false});
			}
		}).catch((error) => {
			res.status(400).json({invalidLogin: true});
		})
});

app.post('/signup', (req,res) => {
	const userInfo = req.body;
	const user = new User({
		_id:mongoose.Types.ObjectId(),
		name:userInfo.name,
		userID:userInfo.userID,
		location:userInfo.location,
		phoneNum:userInfo.phoneNum,
		email:userInfo.email,
		password:userInfo.password,
		aboutMe:userInfo.aboutMe,
		role:userInfo.role,
		image: 'images/default.jpg'
	});
	console.log(user)
	user.save().then((result) => {
		// Save and send object that was saved
		res.send(result)
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})

app.post('/users/follow/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;

	User.findOne({_id: rid}).then((user) => {
		user.followers.push(uid);
		user.save();
	});

	User.findOne({_id: uid}).then((user) => {
		user.following.push(rid);
		user.save();
	});

	res.json({message: 'successfully followed'});
});

app.delete('/users/follow/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;

	User.findOne({_id: rid}).then((user) => {
		user.followers.remove(uid);
		user.save();
	});

	User.findOne({_id: uid}).then((user) => {
		user.following.remove(rid);
		user.save();
	});

	res.json({message: 'successfully unfollowed'});
});

app.delete('/restaurants/follow/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;

	User.findOne({_id: rid}).then((user) => {
		user.followers.remove(uid);
		user.save();
	});

	User.findOne({_id: uid}).then((user) => {
		user.following.remove(rid);
		user.save();
	});

	res.json({message: 'successfully unfollowed'});
});

app.post('/restaurants/follow/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;

	Restaurant.findOne({_id: rid}).then((restaurant) => {
		restaurant.followers.push(uid);
		restaurant.save();
	});

	User.findOne({_id: uid}).then((user) => {
		user.restaurantsFollowing.push(rid);
		user.save();
	});

	res.json({message: 'successfully followed'});
});

app.delete('/admin/users/:uid', (req, res) => {
	const uid = req.params.uid;
	User.findOneAndRemove({_id: uid}, function(error, data) {
		if(!error) {
			console.log("Deleted")
		}
	})
})

app.delete('/admin/restaurants/:rid', (req, res) => {
	const rid = req.params.rid;
	Restaurant.findOneAndRemove({_id: rid}, function(error, data) {
		if(!error) {
			console.log("Deleted")
		}
	})
})

app.post('/restaurants/review/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;
	const comment = req.body.comment;
	const rating = req.body.rating;

	const newResReview = new RestaurantReview({
		_id: mongoose.Types.ObjectId(),
		user: uid,
		restaurant: rid,
		comment: comment,
		rating: rating,
		date: new Date()
	});

	newResReview.save().then((review) => {
		Restaurant.findOne({_id: rid}).then((restaurant) => {
			restaurant.reviews.push(review._id);
			restaurant.save().then((restaurant) => {
				res.json({restaurant: restaurant, review: review});
			});
		});

		User.findOne({_id: uid}).then((user) => {
			user.restaurantReviews.push(review._id);
			user.save();
		});
	});
});

app.post('/dishes/review/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;
	const comment = req.body.comment;
	const rating = req.body.rating;

	const newDishReview = new DishReview({
		_id: mongoose.Types.ObjectId(),
		user: uid,
		dish: rid,
		comment: comment,
		rating: rating,
		date: new Date()
	});

	newDishReview.save().then((review) => {
		Dish.findOne({_id: rid}).then((dish) => {
			dish.reviews.push(review._id);
			dish.save().then((dish) => {
				res.json({dish: dish, review: review});
			});
		});

		User.findOne({_id: uid}).then((user) => {
			user.dishReviews.push(review._id);
			user.save();
		});
	});
});

app.delete('/restaurants/follow/:rid/:uid', (req, res) => {
	const rid = req.params.rid;
	const uid = req.params.uid;

	Restaurant.findOne({_id: rid}).then((restaurant) => {
		restaurant.followers.remove(uid);
		restaurant.save();
	});

	User.findOne({_id: uid}).then((user) => {
		user.restaurantsFollowing.remove(rid);
		user.save();
	});

	res.json({message: 'successfully unfollowed'});
});

app.delete('/restaurants/:revid', (req, res) => {
	const revID = req.params.revid;
	RestaurantReview.findOne({_id:revID}).then((result) => {
		const uid = result.user._id;
		const restID = result.restaurant._id;
		Restaurant.find({_id:restID}).then((restaurant) => {
			for(let i = restaurant.reviews.length - 1; i >= 0; i--) {
				if(restaurant.reviews[i]._id === revID){
					restaurant.reviews.splice(i,1)
					restaurant.save()
				}
			}
		});
		User.find({_id:uid}).then((user) => {
			for(let i = user.restaurantReviews.length - 1; i >= 0; i--) {
				if(user.restaurantReviews[i]._id === revID){
					user.restaurantReviews.splice(i,1)
					user.save()
				}
			}
		});
		RestaurantReview.findOneAndRemove({_id: revID}, function(error, data) {
			if(!error) {
				console.log("Deleted")
			}
		})
	})
});

app.delete('/dishes/:revid', (req, res) => {
	const revID = req.params.revid;
	console.log(revID)
	DishReview.findOne({_id:revID}).then((result) => {
		const uid = result.user;
		console.log(result)
		User.findOne({_id:uid}).then((user) => {
			console.log(user.dishReviews)
			for(let i = user.dishReviews.length - 1; i >= 0; i--) {
				if(user.dishReviews[i]._id === revID){
					user.dishReviews.splice(i,1)
					user.save()
				}
			}

			DishReview.findOneAndRemove({_id: revID}, function(error, data) {
				if(!error) {
					res.json({message: 'deleted'});
				}
			})
		});
	})
});

app.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
