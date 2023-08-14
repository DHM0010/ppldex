const router = require('express').Router();
const { User } = require('../../models');

// router.get('/', async (req, res) => {
//     try {
//         const userData = await User.findAll();

//         res.status(200).json(userData);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });

// Sign-up Route - Creates a new user (Works)
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Login-Route - Logins existing user (Works)
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { username: req.body.username }
        })

        if (!userData) {
            res
            .status(400)
            .json({ message: 'Incorrect username or password, please try again.'});
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
            .status(400)
            .json({ message: 'Incorrect username or password, please try again.'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: "You are now logged in!"});
        })
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/login', (req, res) => {

})

module.exports = router;