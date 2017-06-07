const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here
// wrap all routes in this catch error function
const { catchErrors } = require('../handlers/errorHandlers');

// for middleware
// router.get('/', storeController.myMiddleware, storeController.homePage);
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

// router.get('/', (req, res) => {

//   // const derp = {name: 'chris', age: 100, cool: true };
//   // res.send('Hey! It works!');
//   // res.json(derp);
//   // res.json(req.query);
//   res.render('hello', {
//   	name: "Chris",
//   	dog: "derp",
//   	title: "I love food"
//   });
// });

// router.get('/reverse/:name', (req, res) => {
// 	const reverse = [...req.params.name].reverse().join('');
// 	res.send(req.params.name + " " + reverse);
// })

module.exports = router;
