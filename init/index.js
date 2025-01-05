const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");


main().then(()=>{
    console.log("connection succesful " );
    
}).
catch(err => {console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async ()=>{
    listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj ,
        owner: "676ff164e11c41bb1407e94b",
    
    }))
    await listing.insertMany(initData.data);
    console.log("data is initilize");
    
}

initDB();