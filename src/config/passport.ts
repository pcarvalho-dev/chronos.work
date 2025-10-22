import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';

passport.use(
    new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({where: {email}});

            if (!user) {
                return done(null, false, {message: 'Incorrect email.'});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, {message: 'Incorrect password.'});
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {id}});
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
