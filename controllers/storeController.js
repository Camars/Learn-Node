const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
	// fileFilter: function(req, file, next) {
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};

// exports.myMiddleware = (req, res, next) => {
// 	req.name = 'Chris';
// 	next();
// }

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

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
  // set the location data to be a point
  req.body.location.type = 'Point';
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
  res.redirect(`/stores/${store._id}/edit`);
  // Redriect them the store and tell them it worked
};

exports.getStoreBySlug = async (req, res, next) => {
			// Check route works
	// res.send('It works!');
			// check what store data i needed
	// res.json(req.params); 
	// find info in DB and await the response
	const store = await Store.findOne({ slug: req.params.slug });
			// check data came back
	// res.json(store);
	if(!store) return next();
	res.render('store', { store, tite: store.name });
}









