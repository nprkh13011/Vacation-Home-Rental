const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const {ObjectId} = require("mongodb");
const bcrypt = require("bcryptjs/dist/bcrypt");
const saltRounds = 10;

function validateEmail(email) {
  //email error checking
  //https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression

  let re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (re.test(email.trim()) === false) {
    throw "INVALID EMAIL! TRY AGAIN!";
  }
}

function validatePhone(phone) {
  //phone error
  //https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (re.test(phone.trim()) === false) {
    throw "INVALID PHONE NUMBER! TRY AGAIN!";
  }
}

//instead of asking for birthdate as stated in db proposal- -- just ask for age
const exportedMethods = {
  //INCOMPLETE --- Authentication
  async createUser(username, password, firstname, lastname, email, age, phone) {
    //include authentication
    try {
      console.log(0);
      const hashedPass = await bcrypt.hash(password, saltRounds);
      console.log(hashedPass);
      // let savedListings = [];
      // error checking
      console.log(1);

      if (!firstname || !lastname || !email || !age || !phone || !username || !password) {
           throw "MISSING ONE OR MORE USER DETAILS. TRY AGAIN!"; // either alert or throw?

      }
      console.log(2);

      if (typeof username !== "string" || typeof password !== "string" || typeof firstname !== "string"
          || typeof lastname !== "string" || typeof email !== "string"|| typeof phone !== "string"){
              throw "ERROR: MUST BE A STRING";
      }
      console.log(3);

      if (typeof age !== "number") {
        throw "ERROR: AGE MUST BE A NUMBER";
      }
      console.log(4);

      if (age > 122 || age < 0) {
        throw "ERROR: AGE MUST BE VALID";
      }
      console.log(5);

      username = username.trim();
      if (username.trim().length === 0) {
        throw "ERROR: USERNAME CAN'T HAVE EMPTY SPACES!";
      }
      console.log(6);

      if (password.trim().length === 0) {
        throw "ERROR: PASSWORD CAN'T HAVE EMPTY SPACES!";
      }
      console.log(7);
      if (
        firstname.trim().length === 0 ||
        lastname.trim().length === 0 ||
        email.trim().length === 0 ||
        phone.trim().length === 0
      ) {
        throw "ERROR: FIELDS CAN'T HAVE EMPTY SPACES!";
      }
      console.log(8);
      //https://stackoverflow.com/questions/15933727/javascript-regular-expression-for-usernames-no-spaces
      let reUser = /^[a-zA-Z0-9]{4,}$/; // I did up to unlimited characters
      if (reUser.test(username) === false) {
        throw "ERROR: MUST BE A VALID STRING!";
      }
      console.log(9);
      //FIX THIS
      let rePass = /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/; // I did up to unlimited characters
      if (rePass.test(password) === false) {
        throw "ERROR: MUST BE A VALID STRING!";
      }
      //email checking
      email = email.toLowerCase();
      validateEmail(email);
      //phone checking
      validatePhone(phone);
      console.log(10);
      const userCollection = await users();
      console.log("RAN");
      let duplicateUser = await userCollection.findOne(
              {username: username}
      );
      console.log(10.6);
      if (Object.keys(duplicateUser).length === 0){ // if there is no user like this 
        console.log(10.7);
        insertData = userCollection.insertOne({
            username: username,
            password: hash
        }) 
       return {userInserted: true};
    } else {
        console.log(10.8);
        if (duplicateUser) {
        throw "ERROR: DUPLICATE USER FOUND";
        }
    }
      // check if user exists before storing into MongoDb
      // Check user for authentication
      console.log(11);
      let newUserInfo = {
        username: username.trim(),
        password: hashedPass,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        age: age,
        phone: phone.trim(),
        // savedListings: savedListings // unsure yet - WANT TO SAVE WHATEVER LISTING USERS INTERESTED INTO THEIR "SAVED" INFORMATION
      };
      console.log(12);
      const insertInfo = await userCollection.insertOne(newUserInfo);
      if (
        !insertInfo.acknowledged ||
        !insertInfo.insertedId ||
        insertInfo.insertedCount === 0
      ) {
        throw "ERROR: COULD NOT CREATE USER";
      }
      console.log(13);
      const newId = insertInfo.insertedId;
      const newUser = await userCollection.findOne(newId);
      if (!newUser) {
        throw "ERROR: UNABLE TO FIND USER";
      }
      console.log(14);
      newUser._id = newUser._id.toString();
      return newUser;
    } catch (e) {
      console.log(e);
    }
  },
  async checkUser(username, password) {
    const userCollection = await users();
    if (!username || !password) {
      throw "ERROR: USERNAME AND PASSWORD MUST BE INPUTTED";
    }
    if (typeof username !== "string") {
      throw "ERROR: USERNAME MUST BE A STRING";
    }
    username = username.trim();
    if (username.trim().length === 0) {
      throw "ERROR: USERNAME CAN'T HAVE EMPTY SPACES";
    }
    if (username.trim().length < 4) {
      throw "ERROR: MUST HAVE 4 OR MORE CHARACTERS";
    }
    //https://stackoverflow.com/questions/15933727/javascript-regular-expression-for-usernames-no-spaces
    let reUser = /^[a-zA-Z0-9]{4,}$/; // I did up to unlimited characters
    if (reUser.test(username) === false) {
      throw "ERROR: MUST BE A VALID STRING!";
    }
    if (typeof password !== "string") {
      throw "ERROR: PASSWORD MUST BE A STRING!";
    }
    let rePass = /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/; // I did up to unlimited characters
    if (rePass.test(password) === false) {
      throw "ERROR: MUST BE A VALID STRING!";
    }
    let Query; // query the db
    let compareFoundUser; // compare the passwords
    try {
      //try catch for mongodb works
      // console.log("checkUser-0")
      Query = await userCollection.findOne({
        username: username,
      });
      // console.log("query "+JSON.stringify(Query))
      // if (!Query){ // if there is a username not found
      if (Object.keys(Query).length === 0) {
        throw "Either the username or password is invalid";
      } else {
        // if username found
        // password - plaintext
        // query - is hashed
        compareFoundUser = await bcrypt.compare(password, Query.password);
        // console.log(compareFoundUser);
        if (!compareFoundUser) {
          throw "Either the username or password is invalid";
        } else {
          return {
            authenticated: true,
          };
        }
      }
    } catch (e) {
      throw e;
    }
  },
  async getAllUsers() {
    const userCollection = await users();
    const getAllUser = await userCollection.findOne({}).toArray();
    if (!getAllUser) {
      throw "ERROR: UNABLE TO GET ALL USERS";
    }
    for (let i = 0; i < getAllUser.length; i++) {
      getAllUser[i]["_id"] = getAllUser[i]["_id"].toString();
    }
    return getAllUser;
  },

  async get(id) {
    const userCollection = await users();
    if (!id) {
      throw "ERROR: ID DOES NOT EXIST";
    }
    if (typeof id !== "string") {
      throw "ERROR: ID MUST BE A STRING";
    }
    if (id.trim().length === 0) {
      throw "ERROR: ID CAN'T BE EMPTY STRING";
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    const getuser = await userCollection.findOne({
      _id: ObjectId(id),
    });
    if (!getuser) {
      throw "ERROR: CAN'T FIND USER BY ID";
    }
    getuser._id = getuser._id.toString();
    return getuser;
  },

  async remove(id) {
    const userCollection = await users();
    const userID = await get(id);
    if (!id) {
      throw "ERROR: MUST PROVIDE ID!";
    }
    if (typeof id !== "string") {
      throw "ERROR: ID MUST BE A STRING";
    }
    if (id.trim().length === 0) {
      throw "ERROR: ID CAN'T BE EMPTY STRING";
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    const deleteId = await userCollection.deleteOne({
      _id: ObjectId(id),
    });
    if (deleteId.deletedCount === 0) {
      // if band can't be removed
      throw `ERROR: CAN'T DELETE USER WITH ID OF ${id}`;
    }
    return userID.name + " has been successfully deleted!";
  },
  //update User profile
  async update(id, firstname, lastname, email, age, phone) {
    if (!id || !firstname || !lastname || !email || !age || !phone) {
      throw "ERROR: ALL FIELDS MUST HAVE AN INPUT!";
    }
    // error check #2 part 1
    if (
      typeof id !== "string" ||
      typeof firstname !== "string" ||
      typeof lastname !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string"
    ) {
      throw "ERROR: ID MUST BE A STRING!";
    }
    if (typeof age !== "number") {
      throw "ERROR: AGE MUST BE A NUMBER";
    }
    // error check #2 part 2
    if (
      id.trim().length === 0 ||
      firstname.trim().length === 0 ||
      website.trim().length === 0 ||
      recordLabel.trim().length === 0
    ) {
      throw "ERROR: ID CAN'T BE EMPTY STRING!";
    }
    //error check #3
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    validateEmail(email);
    validatePhone(phone);
    const userCollection = await users();
    let currentUser = await this.get(id);
    if (!currentUser) {
      throw `ERROR: USER DOES NOT EXIST WITH ID ${id}`;
    }
    const updateInfo = await userCollection.findOne({
      username: username,
    });
    if (!updateInfo) {
      throw "ERROR: NO BANDS IS PRESENT FOR THAT ID";
    }
    // //hash password
    // const hashPass = await bcrypt.hash(password, saltRounds);
    let UsersUpdateInfo = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      age: age,
      phone: phone,
    };

    // if there's no update, throw error
    if (
      UsersUpdateInfo.firstname === currentUser.firstname &&
      UsersUpdateInfo.lastname === currentUser.lastname &&
      UsersUpdateInfo.email === currentUser.email &&
      UsersUpdateInfo.age === UsersUpdateInfo.age &&
      UsersUpdateInfo.phone === currentUser.phone
    ) {
      throw "ERROR: THERE NEEDS TO BE AN UPDATE!";
    }

    const updateI = await userCollection.updateOne({
      _id: ObjectId(id),
    }, {
      $set: UsersUpdateInfo,
    });
    if (updateI.modifiedCount === 0) {
      throw "ERROR: UPDATE FAILED!";
    }
    return await this.get(id.trim());
  },
  // if the user wants to edit their password -- then that updates all the data
  async editUsername(id, username) {
    if (!id) {
      throw "ERROR: MUST PROVIDE ID OF USER!";
    }
    if (typeof id !== "string") {
      throw "ERROR: MUST BE A STRING";
    }
    const userCollection = await users();
    let user = await userCollection.findOne({
      username: username,
    });
    if (!user) {
      throw "ERROR: USERNAME ALREADY EXISTS";
    } else {
      let updateI = await userCollection.updateOne({
        _id: id,
      }, {
        $set: {
          username: username,
        },
      });
      if (!updateI.matchedCount && !updateI.modifiedCount) {
        throw "ERROR: UPDATE FAILED!";
      }
      return await this.get(id.trim());
    }
  },
  //if the user wants to edit their password -- then that updates all the data
  async editPassword(id, password) {
    if (!id) {
      throw "ERROR: MUST PROVIDE ID OF USER!";
    }
    if (typeof id !== "string") {
      throw "ERROR: MUST BE A STRING";
    }
    const userCollection = await users();
    let updateI = await userCollection.updateOne({
      _id: id,
    }, {
      $set: {
        password: password,
      },
    });
    if (!updateI.matchedCount && !updateI.modifiedCount) {
      throw "ERROR: UPDATE FAILED!";
    }
    return await this.get(id.trim());
  },
};

module.exports = exportedMethods;