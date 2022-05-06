const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.property;
const {ObjectId} = require("mongodb");

//instead of asking for birthdate as stated in db proposal- -- just ask for age
const exportedMethods = {
  async createProperty(propertytype, location, price, max_night, min_night, details, desc) {
    try {
    //   console.log(1);
      if (!propertytype || !location || !price || !max_night || !min_night || !details || !desc) {
           throw "ERROR: MISSING ONE OR MORE PROPERTY DETAILS. TRY AGAIN!"; // either alert or throw?
      }
    //   console.log(2);
      if (typeof propertytype !== "string" || typeof location !== "string" || typeof desc !== "string"){
              throw "ERROR: MUST BE A STRING";
      }
    //   console.log(3);

      if (typeof price !== "number") {
        throw "ERROR: PRICE MUST BE A NUMBER";
      }
      if (typeof max_night !== "number" || typeof min_night !== "number"){
        throw "ERROR: NUMBER OF NIGHTS MUST BE A NUMBER"
    }
    //   console.log(5);
      if (typeof details !== 'object' || details === null || Array.isArray(details)){ // 
        throw "ERROR: DETAILS MUST BE AN OBJECT"
      }
      if(!("Bedrooms" in details) || !("Beds" in details) || !("Bathrooms" in details) || !("Kitchen" in details)) {
        throw "ERROR: DETAILS MUST INCLUDE ALL FIELDS"
      }
    for(let detail in details) {
        if(typeof details[detail] !== "number")
            throw "ERROR: INVALID FIELDS IN DETAILS";
    }
    //   console.log(6);
      if (
        propertytype.trim().length === 0 ||
        location.trim().length === 0 ||
        desc.trim().length === 0
      ) {
        throw "ERROR: FIELDS CAN'T HAVE EMPTY SPACES!";
      }
    //   console.log(7);
      const propertyCollection = await properties();
      let propertyInfo = {
        propertytype: propertytype.trim(),
        location: location.trim(),
        price: price,
        max_night: max_night,
        min_night: min_night,
        details: details,
        description: desc.trim()
      };
    //   console.log(8);
      const insertInfo = await propertyCollection.insertOne(propertyInfo);
      if (
        !insertInfo.acknowledged ||
        insertInfo.insertedCount === 0
      ) {
        throw "ERROR: COULD NOT CREATE USER";
      }
    //   console.log(9);
      const newId = insertInfo.insertedId;
      const newUser = await propertyCollection.findOne(newId);
      if (!newUser) {
        throw "ERROR: UNABLE TO FIND USER";
      }
    //   console.log(10);
      newUser._id = newUser._id.toString();
      return newUser;
    } catch (e) {
      console.log(e);
    }
  },

  async getAllProperties() {
    const propertyCollection = await properties();
    const getAllProperty = await propertyCollection.find({}).toArray();
    if (!getAllProperty) {
      throw "ERROR: UNABLE TO GET ALL PROPERTIES";
    }
    for (let i = 0; i < getAllProperty.length; i++) {
        getAllProperty[i]["_id"] = getAllProperty[i]["_id"].toString();
    }
    return getAllProperty;
  },
  async get(id) {
    const propertyCollection = await properties();
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
    const getProperty = await propertyCollection.findOne({
      _id: ObjectId(id),
    });
    if (!getProperty) {
      throw "ERROR: CAN'T FIND USER BY ID";
    }
    getProperty._id = getProperty._id.toString();
    return getProperty;
  },
  async remove(id) {
    const propertyCollection = await properties();
    const propertyID = await this.get(id);
    const propertyname = propertyID.name;
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
    const deleteId = await propertyCollection.deleteOne({
      _id: ObjectId(id)
    });
    if (deleteId.deletedCount === 0) {
      throw `ERROR: CAN'T DELETE USER WITH ID OF ${id}`;
    }
    return `${propertyname} has been successfully deleted!`;
  },

  //update property listings 
  async update(id, propertytype, location, price, max_night, min_night, details, desc) {
    if (!propertytype || !location 
        || !price || !max_night 
        || !min_night || !details || !desc) {
      throw "ERROR: ALL FIELDS MUST HAVE AN INPUT!";
    }
    // error check #2 part 1
    if (
      typeof propertytype !== "string" ||
      typeof location !== "string" ||
      typeof desc !== "string"
    ) {
      throw "ERROR: MUST BE A STRING!";
    }
    if (typeof price !== "number") {
      throw "ERROR: PRICE MUST BE A NUMBER";
    }
    if (typeof max_night !== "number" || typeof min_night !== "number"){
        throw "ERROR: NUMBER OF NIGHTS MUST BE A NUMBER"
    }
    // error check #2 part 2
    if (
      propertytype.trim().length === 0 ||
      location.trim().length === 0 ||
      desc.trim().length === 0
    ) {
      throw "ERROR: CAN'T BE EMPTY STRING!";
    }
    //error check #3
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    const propertyCollection = await properties();
    let currentUser = await this.get(id);
    if (!currentUser) {
      throw `ERROR: USER DOES NOT EXIST WITH ID ${id}`;
    }
    const updateInfo = await propertyCollection.findOne({
      _id: ObjectId(id)
    });
    if (!updateInfo) {
      throw "ERROR: NO BANDS IS PRESENT FOR THAT ID";
    }
   
    let PropertyUpdateInfo = {
      propertytype: propertytype,
      location: location,
      price: price,
      max_night: max_night,
      min_night: min_night,
      details: details,
      description: desc
    };

    // if there's no update, throw error
    if (
        PropertyUpdateInfo.propertytype === currentUser.propertytype &&
        PropertyUpdateInfo.location === currentUser.location &&
        PropertyUpdateInfo.price === currentUser.price &&
        PropertyUpdateInfo.max_night === currentUser.max_night &&
        PropertyUpdateInfo.min_night === currentUser.min_night &&
        PropertyUpdateInfo.details === currentUser.details &&
        PropertyUpdateInfo.description === currentUser.description
    ) {
      throw "ERROR: THERE NEEDS TO BE AN UPDATE!";
    }

    const updateI = await propertyCollection.updateOne({
      _id: ObjectId(id),
    }, {
      $set: PropertyUpdateInfo
    });
    if (updateI.modifiedCount === 0) {
      throw "ERROR: UPDATE FAILED!";
    }
    return await this.get(id.trim());
  },
};

module.exports = exportedMethods;