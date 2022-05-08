const express = require("express");
const router = express.Router();
const {
  ObjectId
} = require("mongodb");
const users = require("../data/users");
const properties = require("../data/property");

const xss = require("xss");


router.get("/", async (req, res) => {
  //if a user is authenticated -- redirect to /private
  // else -- render to login page
  // let user = req.session.user;
  if (req.session.user) {
    // if user is authenticated
    res.redirect("/private");
  } else {
    //  not authenticated
    // console.log("LOGIN")
    return res.status(403).render("landing", {
      title: "Rent N' Care",
    });
  }
});
router.post("/signup", async (req, res) => {
  // console.dir("req.body:" + JSON.stringify(req.body));
  // console.log("req.body.username:" + req.body.username);
  // console.log("req.body.firstname:" + req.body.fname);
  try {
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    let email = xss(req.body.email);
    let phone = xss(req.body.phone);
    let age = parseInt(xss(req.body.age));
    let firstname = xss(req.body.fname);
    let lastname = xss(req.body.lname);

    //INPUT CHECKING
    // console.log("post-signup1");
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
        error: "ALL FIELDS MUST BE INPUTTED!"
      });
    }
    // console.log("post-signup2");
    username = username.trim();
    if (typeof username != "string" || username.trim().length === 0) {
      return res.status(400).render("error", {
        class: "empty-spaces",
        error: "USERNAME CAN'T HAVE EMPTY SPACES"
      });
    }
    // console.log("post-signup3");
    if (username.trim().length < 4) {
      return res.status(400).render("error", {
        class: "characters",
        error: "USERNAME MUST HAVE 4 OR MORE CHARACTERS"
      });
    }
    // console.log("post-signup4");
    if (typeof password !== "string" || password.trim().length === 0) {
      return res.status(400).render("error", {
        class: "empty-spaces",
        error: "PASSWORD CAN'T HAVE EMPTY SPACES"
      });
    }
    // console.log("post-signup5");

    //FIX THIS
    if (password.trim().length < 6) {
      return res.status(400).render("error", {
        class: "characters",
        error: "PASSWORD MUST HAVE 6 OR MORE CHARACTERS"
      });
    }
    //https://stackoverflow.com/questions/15933727/javascript-regular-expression-for-usernames-no-spaces
    // console.log("post-signup6");

    let reUser = /^[a-zA-Z0-9]{4,}$/; // I did up to unlimited characters
    if (reUser.test(username) === false) {
      return res.status(400).render("error", {
        error: "MUST BE A VALID USERNAME!"
      });
    }
    // console.log("post-signup7");
    //FIX THIS
    let rePass = /^[ A-Za-z0-9_@.\#&+-]{6,}$/;
    //  /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/; // I did up to unlimited characters
    if (rePass.test(password) === false) {
      console.log("post-signup7-ERROR");
      return res.status(400).render("error", {
        error: "MUST BE A VALID PASSWORD!"
      });
    }

    if (
      typeof firstname !== "string" ||
      typeof lastname !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string"
    ) {
      return res.status(400).render("error", {
        error: "MUST BE A STRING!"
      });
    }
    if (typeof age !== "number") {
      return res.status(400).render("error", {
        error: "AGE MUST BE A NUMBER!"
      });
    }
    if (age > 120 || age < 18) {
      return res.status(400).render("error", {
        error: "MUST BE A VALID AGE"
      });
    }
    if (
      firstname.trim().length === 0 ||
      lastname.trim().length === 0 ||
      email.trim().length === 0 ||
      phone.trim().length === 0
    ) {
      return res.status(400).render("error", {
        error: "MUST BE NOT BE EMPTY!"
      });
    }
    try {
      //call the createUser function
      // console.log("post-signup8");
      let postUser = await users.createUser(
        username,
        password,
        firstname,
        lastname,
        email,
        age,
        phone
      );
      req.session.user={
        id: postUser._id,
        username: username
      }      
      res.redirect('/login');
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    return res.status(400).render("signup", {
      error: e
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

router.get("/login", async (req, res) => {
  //if a user is authenticated -- redirect to /private
  // else -- render to signup page
  // let user = req.session.user;

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
        id: checkLogin.id,
        username: username
      };
      res.redirect("/private");
    } else {
      return res.status(400).render("login", {
        error: "Username and/or password entered incorrectly",
      });
    }
  } catch (e) {
    // console.log("login-2")
    return res.status(400).render("login", {
      error: "Username and/or password not valid",
    });
  }
});
//get route /private - from professor's github
router.get("/private", async (req, res) => {
  try {
    let username = xss(req.session.user.username);
    return res.status(200).render("private", {
      title: "Profile",
      username: username,
      authenticated: true
    });
  } catch (e) {
    return res.status(400).render("private", {
      error: "Could not enter profile page",
    });
  }
});
/*
private(profile) --> listings (cards)
listings --> descriptions (set of listings in that country) /id
descriptions --> description/id
*/
router.get("/listings", async (req, res) => {
  const prop = await properties.getAllProperties();
  if (req.session.user) { //render -- handlebars
    res.status(200).render('listings', {
      title: `Listings`,
      AllListings: prop
    })
  } else {
    res.status(400).render('private', {
      error: 'Could not load listings'
    });
  }
});

// //get route /private/listings/descriptions - from professor's github
router.get("/descriptions", async (req, res) => {
  if (req.session.user) { //render -- handlebars
    res.status(200).render('allprop', {
      title: "Properties"
    })
    // res.status(200).json();
  } else {
    res.status(400).render('private', {
      error: 'Could not load the description'
    });
  }
});
//when it clicks on the view button 
router.get("/descriptions/:id", async (req, res) => {
  let id = xss(req.params.id);
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "ID not valid"
    })
  }
  const getid = await properties.get(id);
  if (req.session.user) { //render -- handlebars
    res.status(200).render('descriptions', {
      title: "Property Details",
      Listing: getid
    })
    // res.status(200).json(getid);
  } else {
    res.status(400).render('private', {
      error: 'Could not load the description'
    });
  }
});

router.get("/editUsername", async (req, res) => {
  if (req.session.user) { //render -- handlebars
    res.status(200).render('editUsername', {
      title: "Account",
      authenticated: true
    })
    // res.status(200).json();
  } else {
    res.status(400).render('private', {
      error: 'Could not load the description'
    });
  }
});

//edit username in account ---- DOESN'T WORK
router.post("/editUsername", async (req, res) => {
  try {
    let id = req.session.user.id;
    console.log(id);
    let oldusername = xss(req.body.username);
    console.log("Username:" + oldusername);
    let newUsername = xss(req.body.newUsername);
    console.log("New Username:" + newUsername);

    // const userId = await users.get(id);
    // console.log(userId);
    // let edit = await users.editUsername(id, xss(oldusername));
    // console.log(edit)
    if (!ObjectId.isValid(id)) {
      return res.status(400).render('error', {
        error: "ID not valid"
      })
    }
    if (!oldusername || !newUsername) {
      return res.status(400).render('error', {
        error: "Username not inputted"
      })
    }
    //duplicate user found
    if (oldusername === newUsername) {
      return res.status(400).render("editUsername", {
        error: "Change name of username",
      });
    } else {
      if (req.session.user) { //render -- handlebars
        let edit = await users.editUsername(id, xss(newUsername));
        res.status(200).render('editUsername', {
          message: "Successfully Updated User"
        })
        // res.status(200).json();
      } else {
        res.status(400).render('private', {
          error: 'Could not load the description'
        });
      }
    }
  } catch (e) {
    res.status(400).render('editUsername', {
      error: 'Could not update user'
    });
  }

});

// router.get("/deleteAccount", async (req, res) => {
//   if (req.session.user) { //render -- handlebars
//   await users.remove(req.session.id);
//   confirm("Are you sure you want to delete this account?")
//   } else {
//     res.status(400).render('private', {
//       error: 'Could not load the description'
//     });
//   }
// });
router.get("/logout", async (req, res) => {
  req.session.destroy();
  // res.send('Logged out');
  res.redirect("/");
});


module.exports = router;