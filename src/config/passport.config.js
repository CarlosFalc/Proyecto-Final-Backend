import passport from "passport";
import localStrategy from "passport-local";
import githubStrategy from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";


export const initializePassport = ()=>{
    passport.use("registerStrategy", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"            
        },
        async(req, username, password, done)=>{
            try {
                const userRegisterForm = req.body;
                const user = await userModel.findOne({email:username});

                if (!user) {

                    if (userRegisterForm.email.endsWith("@coder.com") && userRegisterForm.password.startsWith("adminCod3r")) {
                        userRegisterForm.role = "admin";
                        userRegisterForm.password = createHash(userRegisterForm.password);
                        const userCreated = await userModel.create(userRegisterForm);
                        console.log(userCreated);
                        return done(null, userCreated);
                    }else{
                        userRegisterForm.password = createHash(userRegisterForm.password);
                        const userCreated = await userModel.create(userRegisterForm);
        
                    console.log(userCreated);
                        
                    return done(null, userCreated);
                        }
                }else{
                    return done(null, false);
                }

            } catch (error) {
                return done(error);
            }
            
        }
    ));

                
//Estrategia de login
    passport.use("loginStrategy", new localStrategy(
        {
            usernameField: "email"
        },
        async(username, password,done)=>{
            try {
                const userDB = await userModel.findOne({email:username});
    
                if (userDB) {
                    
                    if (isValidPassword(password, userDB)) {
                        return done(null, JSON.parse(JSON.stringify(userDB)));
                    } else{
                        return done(null,false);
                    }
    
                } else {
                    return done(null, false);
                }
    
    
            } catch (error) {
                return done(error);
            }
    
        }
    ));


//Estrategia de inicio de sesión de Github
passport.use("githubLogin", new githubStrategy(
    {
        clientID:"Iv1.33b5d0e78518f5a6",
        clientSecret:"c0e139774a432bc210cf0d800bb3f368b9f6b599",
        callbackUrl:"http://localhost:8080/api/sessions/github-callback"
    },
    async(accesstoken, refreshtoken, profile, done)=>{
            try {
               console.log("profile: ", profile); 

               const user = await userModel.findOne({email:profile.username});
               
               if(!user){

                    const newUser = {
                        first_name: profile.username,
                        last_name:"",
                        age: null,
                        email: profile.username,
                        password: createHash(profile.id)
                    }
                    const userCreated = await userModel.create(newUser);

                    return done (null, userCreated);


               }else{
                return done(null, false);
               }

            } catch (error) {
                return done(error);
            }
    }
));


//Serialización y deserialización
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done)=>{
        const userDB = await userModel.findById(id);
        done(null, userDB);
    });
};