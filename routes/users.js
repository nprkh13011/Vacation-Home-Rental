const express = require("express");
const router = express.Router();
// const session = require('express-session');
const {ObjectId} = require("mongodb");
const bcrypt = require("bcrypt");
const users = require("../data/users");
const xss = require("xss");


router.get("/", async (req, res) => {
    //if a user is authenticated -- redirect to /private
    // else -- render to login page
    // let user = req.session.user;
    // console.log("hi");
    if (req.session.user) {
        // if user is authenticated
        res.redirect("/private");
    } else {
        //  not authenticated
        // console.log("LOGIN")
        return res.status(403).render("landing", {
            title: "landing page",
        });
    }
});
router.get("/signup", async (req, res) => {
    //if a user is authenticated -- redirect to /private
    // else -- render to signup page
    // let user = req.session.user;
    // console.log("hi-signup");
    if (req.session.user) {
        // if user is authenticated
        res.redirect("/private");
    } else {
        //  not authenticated
        return res.status(200).render("signup", {
            title: "Sign-Up",
            user: req.session.user,
        });
    }
});

router.post("/signup", async (req, res) => {
    let userInfo = req.body;
    console.log(req.body);
    try {
        let username = xss(userInfo.username);
        let password = xss(userInfo.password);
        let email = xss(userInfo.email);
        let phone = xss(userInfo.phone);
        let age = parseInt(xss(userInfo.age));
        let firstname = xss(userInfo.firstname);
        let lastname = xss(userInfo.lastname);

        //INPUT CHECKING
        console.log("post-signup1");
        if (
            !firstname ||
            !lastname ||
            !email ||
            !age ||
            !phone ||
            !username ||
            !password
        ) {
            return res.status(400).render("error", {
                error: "ALL FIELDS MUST BE INPUTTED!",
            });
        }
        console.log("post-signup2");
        username = username.trim();
        if (typeof username !== "string" || username.trim().length === 0) {
            return res.status(400).render("error", {
                class: "empty-spaces",
                error: "USERNAME CAN'T HAVE EMPTY SPACES",
            });
        }
        console.log("post-signup3");
        if (username.trim().length < 4) {
            return res.status(400).render("error", {
                class: "characters",
                error: "USERNAME MUST HAVE 4 OR MORE CHARACTERS",
            });
        }
        console.log("post-signup4");
        if (typeof password !== "string" || password.trim().length === 0) {
            return res.status(400).render("error", {
                class: "empty-spaces",
                error: "PASSWORD CAN'T HAVE EMPTY SPACES",
            });
        }
        console.log("post-signup5");

        //FIX THIS
        if (password.trim().length < 6) {
          return res.status(400).render("error", {
            class: "characters",
            error: "PASSWORD MUST HAVE 6 OR MORE CHARACTERS",
          });
        }
        //https://stackoverflow.com/questions/15933727/javascript-regular-expression-for-usernames-no-spaces
        console.log("post-signup6");

        let reUser = /^[a-zA-Z0-9]{4,}$/; // I did up to unlimited characters
        if (reUser.test(username) === false) {
            return res.status(400).render("error", {
                error: "MUST BE A VALID USERNAME!",
            });
        }
        console.log("post-signup7");
        //FIX THIS
        let rePass = /^[ A-Za-z0-9_@.\#&+-]{6,}$/;
        //  /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/; // I did up to unlimited characters
        if (rePass.test(password) === false) {
          console.log("post-signup7-ERROR");
          return res.status(400).render("error", {
            error: "MUST BE A VALID PASSWORD!",
          });
        }

        if (
            typeof firstname !== "string" ||
            typeof lastname !== "string" ||
            typeof email !== "string" ||
            typeof phone !== "string"
        ) {
            return res.status(400).render("error", {
                error: "MUST BE A STRING!",
            });
        }
        if (typeof age !== "number") {
            return res.status(400).render("error", {
                error: "AGE MUST BE A NUMBER!",
            });
        }
        if (age > 122 || age < 0) {
            return res.status(400).render("error", {
                error: "MUST BE A VALID AGE",
            });
        }
        if (
            firstname.trim().length === 0 ||
            lastname.trim().length === 0 ||
            email.trim().length === 0 ||
            phone.trim().length === 0
        ) {
            return res.status(400).render("error", {
                error: "MUST BE NOT BE EMPTY!",
            });
        }
        let postUser;
        try {
            // call the createUser function
            console.log("post-signup8");
            postUser = await users.createUser(
                username,
                password,
                firstname,
                lastname,
                email,
                age,
                phone
            );
            console.log(postUser);
            req.session.user = postUser;
            console.log("post-signup8.5")
            res.redirect('/private');
            // req.session.user = postUser;
            // console.log("post-signup8.7")
            if (postUser.userInserted === true) {
                // If -- userinserted: true
                console.log("post-signup9");
                res.redirect("/private");
                
            } else {
                console.log("post-signup10");
                return res.status(500).render("error", {
                    error: "Internal Server Error",
                });
            }
        } catch (e) {
            console.log(e);
        }
       
    } catch (e) {
        return res.status(400).render({error: e});
    }
});
router.get("/login", async (req, res) => {
    //if a user is authenticated -- redirect to /private
    // else -- render to signup page
    // let user = req.session.user;
    // console.log("hi-signup");
    if (req.session.user) {
        // if user is authenticated
        res.redirect("/private");
    } else {
        //  not authenticated
        return res.status(403).render("login", {
            title: "Login",
        });
    }
});
router.post("/login", async (req, res) => {
    /*  
    get req.body username and password
    const { username, password } = req.body;
    here, you would get the user from the db based on the username, then you would read the 
    hashed pw and then compare it to the pw in the req.body
    let match = bcrypt.compare(password, 'HASHED_PW_FROM DB’);
    if they match then set req.session.user and then redirect them to the login page
    I will just do that here 
*/
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    try {
        //INPUT CHECKING
        if (!username || !password) {
            return res.status(400).render("error", {
                class: "invalid",
            });
        }
        if (typeof username !== "string") {
            return res.status(400).render("error", {
                class: "invalid type",
            });
        }
        if (typeof password !== "string") {
            return res.status(400).render("error", {
                class: "invalid type",
            });
        }
        username = username.toLowerCase().trim();
        if (username.trim().length === 0) {
            return res.status(400).render("error", {
                class: "invalid",
                error: "USERNAME CAN'T HAVE EMPTY SPACES",
            });
        }
        if (username.trim().length < 4) {
            return res.status(400).render("error", {
                class: "invalid",
                error: "USERNAME MUST HAVE 4 OR MORE CHARACTERS",
            });
            // throw "ERROR: MUST HAVE 4 OR MORE CHARACTERS"
        }
        if (password.trim().length < 6) {
            return res.status(400).render("error", {
                class: "invalid",
                error: "PASSWORD MUST HAVE 6 OR MORE CHARACTERS",
            });
            // throw "ERROR: MUST HAVE 4 OR MORE CHARACTERS"
        }
        //https://stackoverflow.com/questions/15933727/javascript-regular-expression-for-usernames-no-spaces
        let reUser = /^[a-zA-Z0-9]{4,}$/; // I did up to unlimited characters
        if (reUser.test(username) === false) {
            // throw "ERROR: MUST BE A VALID STRING!";
            return res.status(400).render("error", {
                class: "invalid",
                error: "INVALID USERNAME",
            });
        }
        let rePass = /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/; // I did up to unlimited characters
        if (rePass.test(password) === false) {
            // throw "ERROR: MUST BE A VALID STRING!";
            return res.status(400).render("error", {
                class: "invalid",
                error: "INVALID PASSWORD",
            });
        }
        
        // console.log("login-0")
        const checkLogin = await users.checkUser(xss(username), xss(password));
        //duplicate user found
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username && users[i].password === password) {
                return res.status(400).render("login", {
                    error: "duplicate user found",
                });
            }
        }
        // console.log("login-1")
        if (checkLogin.authenticated === true) {
            req.session.user = {
                username: username,
            };
            res.redirect("/private");
        } else {
            return res.status(400).render("login", {
                error: "Username and/or password entered incorrectly",
            });
        }
    } catch (e) {
        // console.log("login-2")
        return res.status(400).render("error", {
            error: e
        });
    }
});
//get route /private - from professor's github
router.get("/private", async (req, res) => {
    let username = req.session.user.username;
    return res.render("private", {
        username: username,
    });
    // res.json({route: '/private', method: req.method});
});
router.get("/logout", async (req, res) => {
    req.session.destroy();
    // res.send('Logged out');
    res.redirect("logout", {});
});


       
       
module.exports = router;