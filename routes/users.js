import express from 'express';

const router = new express.Router();

router.use('/login', async (req, res) => {
	try {
		if (req.method !== 'POST' || !req.body) throw (new Error('please use POST with credentials as body'));
		// const loginUser = require('../modules/users/login');
		// const user = await loginUser(req.body);
		// if (user.id ===-1) throw (new Error('user not found'));
		res.status(200).json({id: 1}); // user
	} catch (error) {
		res.status(400).json({error: error});
	}
});


export default router;
