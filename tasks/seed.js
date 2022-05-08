const { property } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');

const data = require('../data/');
const properties = data.property;
const users = data.users;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    console.log ("---------------------USERS-----------------")
    console.log("CREATE - USER");
    const createuser = await users.createUser("testing", "testing", "test", "testing1", "testing1@gmail.com", 45, "5522356366");
    console.log(createuser);

    console.log("CREATE - USER1");
    const createuser1 = await users.createUser("user1", "password1", "username", "password", "userpass@gmail.com", 20, "1234326366");
    console.log(createuser1);

    try{
        console.log("CHECK - USER1");
        const checkuser1 = await users.checkUser("testing", "testing");
        console.log(checkuser1);
    } catch (e){
        console.log(e)
    }

    console.log("CREATE - USER2");
    const createuser2 = await users.createUser("adminUser", "adminUser101", "Admin", "User", "adminuser5@gmail.com", 23, "20368369016");
    console.log(createuser2);

    try{
        console.log("CHECK - USER2");
        const checkuser2 = await users.checkUser("adminUser", "adminUser101");
        console.log(checkuser2);
    } catch (e) {
        console.log(e)
    }
    console.log("CREATE - USER3");
    const createuser3 = await users.createUser("nparekh2", "nparekh2", "npar", "npar", "npar2@gmail.com", 19, "5446268307");
    console.log(createuser3);

    try{
        console.log("CHECK - USER3");
        const checkuser3 = await users.checkUser("nparekh2", "nparekh2");
        console.log(checkuser3);
    } catch (e) {
        console.log(e)
    }

    try{
        console.log("CHECK - USER3 Again");
        const checkuserthree = await users.checkUser("nparekh2", "nparekh2#");
        console.log(checkuserthree);
    } catch (e) {
        console.log(e)
    }
    console.log("CREATE - USER4");
    const createuser4 = await users.createUser("coconut22", "strawberri101$", "coco", "berry", "cberry1@gmail.com", 29, "5516268387");
    console.log(createuser4);

    try{
        console.log("CHECK - USER4");
        const checkuser4 = await users.checkUser("coconut22", "strawberri");
        console.log(checkuser4);
    } catch (e) {
        console.log(e)
    }

    console.log("CREATE - USER5");
    const createuser5 = await users.createUser("docStrange", "wmaximoff", "Stephen", "Wanda", "docStrange4life@gmail.com", 20, "5522356112");
    console.log(createuser5);

    try{
        console.log("CHECK - USER5");
        const checkuser5 = await users.checkUser("docStrange", "wmaximoff");
        console.log(checkuser5);
    } catch (e) {
        console.log(e)
    }

    console.log("CREATE - USER6");
    const createuser6 = await users.createUser("MoonKnight1", "WandaVision1", "Steven", "Grant", "protectSteven@gmail.com", 24, "7611299820");
    console.log(createuser6);

    try{
        console.log("CHECK - USER6");
        const checkuser6 = await users.checkUser("MoonKnight1", "wrongPassword");
        console.log(checkuser6);
    } catch (e) {
        console.log(e)
    }

    console.log("GETALLUSERS - USER4");
    const user4 = await users.getAllUsers();
    console.log(user4);

    console.log("GET - USER5");
    const user5 = await users.get(createuser1._id);
    console.log(user5);

    console.log("DELETE - USER5"); //should be left with 5 in the db
    const user6 = await users.remove(createuser1._id.toString());
    console.log(user6);

    console.log("UPDATE - USER5");
    const user7 = await users.update(createuser2._id, "Janelle", "Rosa", "jrosa235@gmail.com", 27, "5567568366");
    console.log(user7);

    console.log("UPDATE USERNAME - USER5");
    const user8 = await users.editUsername(createuser2._id, "AforEffort");
    console.log(user8);


    console.log ("---------------------PROPERTY-----------------")
    console.log("CREATE - PROPERTY1");
    const createproperty1 = await properties.createProperty("Condo", "Japan", 75, 28, 4, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "Cats not allowed, WiFi provided");
    console.log(createproperty1);

    console.log("CREATE - PROPERTY2");
    const createproperty2 = await properties.createProperty("Townhouse", "Canada", 105, 3, 1, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "No pets allowed");
    console.log(createproperty2);

    console.log("CREATE - PROPERTY3");
    const createproperty3 = await properties.createProperty("Apartment", "France", 200, 14, 2, {"Bedrooms": 1, "Beds": 1, "Bathrooms": 2, "Kitchen": 1}, "Pets allowed, WiFi not provided");
    console.log(createproperty3);

    console.log("CREATE - PROPERTY4");
    const createproperty4 = await properties.createProperty("Single-Family Home", "India", 7000, 28, 3, {"Bedrooms": 2, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "No pets allowed");
    console.log(createproperty4);

    console.log("CREATE - PROPERTY5");
    const createproperty5 = await properties.createProperty("Semi-Detached Home", "Germany", 85, 5, 1, {"Bedrooms": 1, "Beds": 1, "Bathrooms": 1, "Kitchen": 0}, "Maximum 2 Pets allowed, WiFi provided");
    console.log(createproperty5);

    console.log("CREATE - PROPERTY6");
    const createproperty6 = await properties.createProperty("Cottage", "Switzerland", 125, 28, 1, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 1, "Kitchen": 1}, "It's a cute cottage - no pets allowed");
    console.log(createproperty6);

    console.log("CREATE - PROPERTY7");
    const createproperty7 = await properties.createProperty("Apartment", "South Korea", 125, 35, 2, {"Bedrooms": 3, "Beds": 4, "Bathrooms": 2, "Kitchen": 1}, "Pets allowed");
    console.log(createproperty7);

    console.log("CREATE - PROPERTY8");
    const createproperty8 = await properties.createProperty("Apartment", "America", 150, 15, 6, {"Bedrooms": 2, "Beds": 3, "Bathrooms": 2, "Kitchen": 1}, "Pets allowed & WiFI provided");
    console.log(createproperty8);
    console.log("CREATE - PROPERTY9");
    const createproperty9 = await properties.createProperty("Single-Family Home", "Spain", 80, 24, 2, {"Bedrooms": 2, "Beds": 3, "Bathrooms": 2, "Kitchen": 1}, "No Pets allowed & WiFI not provided");
    console.log(createproperty9);
    
    console.log("CREATE - PROPERTY10");
    const createproperty10 = await properties.createProperty("Studio Apartment", "England", 145, 21, 1, {"Bedrooms": 1, "Beds": 1, "Bathrooms": 1, "Kitchen": 1}, "Pets allowed & WiFI provided");
    console.log(createproperty10);

    console.log("CREATE - PROPERTY11");
    const createproperty11 = await properties.createProperty("Villa", "Mexico", 150, 10, 6, {"Bedrooms": 2, "Beds": 3, "Bathrooms": 2, "Kitchen": 1}, "Pets allowed & WiFI provided");
    console.log(createproperty11);

    console.log("CREATE - PROPERTY12");
    const createproperty12 = await properties.createProperty("Single-Family Home", "Australia", 220, 30, 3, {"Bedrooms": 3, "Beds": 4, "Bathrooms": 3, "Kitchen": 1}, "No Pets allowed & WiFI provided");
    console.log(createproperty12);

    console.log("CREATE - PROPERTY13");
    const createproperty13 = await properties.createProperty("Khmer houses", "Cambodia", 90, 5, 1, {"Bedrooms": 2, "Beds": 2, "Bathrooms": 1, "Kitchen": 1}, "No Pets allowed & WiFI not available");
    console.log(createproperty13);

    console.log("GETALL - PROPERTY3");
    const property3 = await properties.getAllProperties();
    console.log(property3);

    console.log("GET - PROPERTY4");
    const property4 = await properties.get(createproperty1._id);
    console.log(property4);

    console.log("Delete - PROPERTY5");
    const property5 = await properties.remove(createproperty1._id.toString());
    console.log(property5);

    // id, propertytype, location, price, max_night, min_night, details, desc
    console.log("Update - PROPERTY6");
    const property6 = await properties.update(createproperty2._id, "Multi-Family House", "Canada", 700, 5, 1, {"Bedrooms": 1, "Beds": 2, "Bathrooms": 2, "Kitchen": 1}, "No pets allowed");
    console.log(property6);


console.log('Done seeding database');

await dbConnection.closeConnection();
}

main();