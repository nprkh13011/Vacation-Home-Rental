const { property } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');

const data = require('../data/');
const properties = data.property;
const users = data.users;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    console.log ("---------------------PROPERTY-----------------")
    console.log("CREATE - PROPERTY1");
    const property1 = await properties.createProperty("Condo", "Japan", 75, 5, 1, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "No pets allowed");
    console.log(property1);

    console.log("CREATE - PROPERTY2");
    const property2 = await properties.createProperty("Apartment", "France", 700, 5, 1, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "No pets allowed");
    console.log(property2);

    console.log("GETALL - PROPERTY3");
    const property3 = await properties.getAllProperties();
    console.log(property3);

    console.log("GET - PROPERTY4");
    const property4 = await properties.get(property1._id);
    console.log(property4);

    console.log("Delete - PROPERTY5");
    const property5 = await properties.remove(property1._id.toString());
    console.log(property5);

    //id, propertytype, location, price, max_night, min_night, details, desc
    console.log("Update - PROPERTY6");
    const property6 = await properties.update(property2._id, "Hut", "France", 700, 5, 1, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "No pets allowed");
    console.log(property6);

    console.log ("---------------------USERS-----------------")
    console.log("CREATE - USER1");
    const user1 = await users.createUser("janetjackson", "jacksonjanet", "Janet", "Jackson", "jjackson@gmail.com", 45, "5522356366");
    console.log(user1);

    console.log("CREATE - USER2");
    const user2 = await users.createUser("janelle23", "Rosario5", "Janelle", "Rosa", "jrosa235@gmail.com", 23, "5567568366");
    console.log(user2);

    console.log("CREATE - USER3");
    const user3 = await users.createUser("farfar", "pathboi", "farfar", "zaza", "zafar5@gmail.com", 21, "0126749777");
    console.log(user3);

    console.log("getAllUsers - USER4");
    const user4 = await users.getAllUsers();
    console.log(user4);

    console.log("Get - USER5");
    const user5 = await users.get(user1._id);
    console.log(user5);

    console.log("Delete - USER5");
    const user6 = await users.remove(user1._id);
    console.log(user6);

    console.log("Update - USER5");
    const user7 = await users.update(user2._id, "Janelle", "Rosa", "jrosa235@gmail.com", 27, "5567568366");
    console.log(user7);

    console.log("Update Username - USER5");
    const user8 = await users.editUsername(user2._id, "AforEffort");
    console.log(user8);


console.log('Done seeding database');

await dbConnection.closeConnection();
}

main();