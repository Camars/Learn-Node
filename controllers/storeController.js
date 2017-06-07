const mongoose = require('mongoose');
const Store = mongoose.model('Store');

// exports.myMiddleware = (req, res, next) => {
// 	req.name = 'Chris';
// 	next();
// }
exports.homePage = (req, res) => {
	console.log(req.name)
	res.render('index');
}

exports.addStore = (req, res) => {
	res.render('editStore', { title:'Add Store' });
}

exports.createStore = async (req, res) => {
	// res.json(req.body);
	const store = await (new Store(req.body)).save();
	req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
	res.redirect(`/store/${store.slug}`);
		// new promise way of doing it
		// .then(store => {
		// 	return Store.find()
		// })
		// .then(store => {
		// 	res.json(store);
		// })
		// .then(store => {
		// 	res.json(store);
		// })
		// .catch(err => {
		// 	throw Error(err);
		// })

		// old way to do it
		// store.save(function(err, store) {
		// 	if(!err) {
		// 		console.log('It worked!');
		// 		reviews.find(function(err, reviews) {
		// 			reviews.find(function(err, reviews) {
		// 				res.redirect('/');
		// 			})
		// 		})
		// 	}
		// })
};

exports.getStores = async (req, res) => {
	// query DB for list of all stores
	const stores = await Store.find();
	// console.log(stores);
	res.render('stores', {title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
	// 1. Find the store given the ID
	// res.json(req.params);
	const store = await Store.findOne({ _id: req.params.id });
	// res.json(store);
	// 2. confirm they are the owner of the store
	// TODO
	// 3. Render out the edit from so the user can update their store
	res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
	// find and update the store
	// const store = Store.findOneAndUpdate(q, data, options)
	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, 
		{
		new: true, // return the new store instead of the old one
		reValidators: true
	}).exec();
	// Redirect them the store and tell them it worked
	req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`)
	res.redirect(`/stores/${store._id}/edit`);
};









