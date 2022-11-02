const User = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../../config');

// register
const signUp = async (req, res) => {
    const { email, password, username } = req.body;
    try {

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password)
        });

        // save dates
        const savedUser = await newUser.save();

        // token
        const tokenUser = jwt.sign({ id: savedUser._id }, config.SECRET, {
            expiresIn: 86400 // 1 day
        })
        res.status(200).json({ success: true, response: 'Successfully registered', token: tokenUser });

    } catch (error) {
        console.log(error)
    }
}

// signin
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {

        // verifi posible exist users
        const verifyUserExistent = await User.findOne({ email: email });

        if (!verifyUserExistent) return res.status(400).json({ success: false, response: 'User not found' });

        const verifyPass = await User.comparePassword(password, verifyUserExistent.password);

        if (!verifyPass) {
            return res.status(401).json({ success: false, response: 'Invalid passwod' });

        } else {
            const token = jwt.sign({ id: verifyUserExistent._id }, config.SECRET, { expiresIn: 86400 });
            return res.status(200).json({
                success: true, response: `${'Welcome ' + `${verifyUserExistent.username}`}`,
                user: { username: verifyUserExistent.username, email: verifyUserExistent.email, password: password, token }
            });
            // res.setHeader('Set-Cookie', token)

            // serialized
            // const serialized = serialize('tokenUser', token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: 'strict',
            //     maxAge: 1000 * 64 * 60 * 24 * 30, 
            //     path: '/'
            // });
            // // console.log(serialized)
            // res.setHeader('Set-Cookie', serialized);
            // // console.log(res.setHeader('Set-Cookie', serialized))
            // return res.status(200).json({ value: true, response: 'Welcome'});
        }


    } catch (error) {
        console.log(error)
    }


}

module.exports = { signIn, signUp }


































// const passport = require('passport');





// const strategy = require('passport-local').Strategy;
// const User = require('../models/users');

// // sewrializar datos para que el usuario pueda navegar en distintas paginas
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     const user = await User.findById(id);
//     done(null, user);
// })

// passport.use('signUp', new strategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true

// }, (req, email, password, done) => {

//     // verifi existent users in db
//     const verifyUserExistent = User.findOne({ email: email });

//     // if (verifyUserExistent) {
//     //     return next(new ErrorResponse("This user exist", 400));

//     // } else {
//         const newUser = new User();
//         newUser.email = email,
//         newUser.password =  newUser.encryptPassword(password);
//         newUser.save()
//         done(null, newUser)
//     // }
//     // if (!email || !password) {
//     //     return next(new ErrorResponse("Please provide an email and password", 400));
//     // }


//     // if (verifyUserExistent) {
//     //     return done(null, false);
//     // } else {

//     // }

// }));