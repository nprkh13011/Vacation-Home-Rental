const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const saltRounds = 10;

const exportedMethods = {
    //INCOMPLETE --- CHECK EMAIL & PHONE
    async createUser(username, password, firstname, lastname, email, dob, phone){ //include authentication
        const hashedPass = await bcrypt.hash(password, saltRounds);
        // console.log(hash);
        let savedListings = [];
        // error checking
        if (!firstname || !lastname || !email || !dob || !phone || !username || !password) {
             throw "MISSING ONE OR MORE USER DETAILS. TRY AGAIN!"; // either alert or throw?
        }
        if (typeof username !== "string" || typeof password !== "string" || typeof firstname !== "string"
            || typeof lastname !== "string" || typeof email !== "string" || typeof dob !== "string"
            || typeof phone !== "string"){
                throw "ERROR: MUST BE A STRING";
        }
        username=username.trim();
        if (username.trim().length === 0){
            throw "ERROR: USERNAME CAN'T HAVE EMPTY SPACES!";
        }
        password = password.trim();
        if (password.trim().length === 0) {
            throw "ERROR: PASSWORD CAN'T HAVE EMPTY SPACES!";
        }
        if (firstname.trim().length ===0 || lastname.trim().length ===0 || email.trim().length ===0 
            || dob.trim().length === 0 || phone.trim().length ===0){
                throw "ERROR: FIELDS CAN'T HAVE EMPTY SPACES!"
            }
        //https://stackoverflow.com/questions/15933727/javascript-regular-expression-for-usernames-no-spaces
        let reUser = /^[a-zA-Z0-9]{4,}$/; // I did up to unlimited characters
        if (reUser.test(username) === false) {
            throw "ERROR: MUST BE A VALID STRING!";
        }
        let rePass = /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/; // I did up to unlimited characters
        if (rePass.test(password) === false) {
            throw "ERROR: MUST BE A VALID STRING!";
        }
        
        // check if user exists before storing into MongoDb
        // Check user for authentication 

        let newUserInfo = {
            username: username,
            password: hashedPass,
            firstname: firstname,
            lastname: lastname,
            email: email,
            date_of_birth: dob,
            phone: phone,
            savedListings: savedListings // unsure yet - WANT TO SAVE WHATEVER LISTING USERS INTERESTED INTO THEIR "SAVED" INFORMATION
        };

        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUserInfo);
        if (!insertInfo.acknowledged || !insertInfo.insertedId || insertInfo.insertedCount === 0) {
            throw "ERROR: COULD NOT CREATE USER";
        }
        
        const newId = insertInfo.insertedId.toString();
        const newUser = await userCollection.findOne(newId);
        if (!newUser){
            throw "ERROR: UNABLE TO FIND USER";
        }
        newUser._id = newUser._id.toString();
        return newUser;
    },
    async getAllUsers(){
        const userCollection = await users();
        const getAllUser = await userCollection.findOne({}).toArray();
        if (!getAllUser){
            throw "ERROR: UNABLE TO GET ALL USERS";
        }
        for (let i=0; i <getAllUser.length; i++){
            getAllUser[i]["_id"] = getAllUser[i]["_id"].toString();
        }
        return getAllUser;
    },
    async get(id){
        const userCollection = await users();
        if (!id){
            throw "ERROR: ID DOES NOT EXIST";
        }
        if (typeof id !== 'string') {
            throw "ERROR: ID MUST BE A STRING";
        }
        if (id.trim().length === 0) {
            throw "ERROR: ID CAN'T BE EMPTY STRING";
        }
        id = id.trim();
        if (!ObjectId.isValid(id)) {
            throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
        }
        const getuser = await userCollection.findOne({_id: ObjectId(id.trim())});
        if (!getuser){
            throw "ERROR: CAN'T FIND USER BY ID";
        }
        getuser._id = getuser._id.toString();
        return getuser;
    },
    async remove(id){ //INCOMPLETE
        const userCollection = await users();
    },
    //INCOMPLETE
    async update(id, username, password, firstname, lastname, email, dob, phone){
        const userCollection = await users();
    }
}



module.exports = exportedMethods;