const mongoose = require("mongoose");

const url = process.env.MONGO;

mongoose.connect(url,{
    useNewUrlParser: true, 
    useUnifiedTopology: true

}).then(()=>console.log("mongodb connected ")).catch((e)=>console.log('error',e))