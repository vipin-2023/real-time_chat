const mongoose = require("mongoose");

const url = process.env.MONGO || "mongodb+srv://12345:12345@cluster0.2wghbnp.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(url,{
    useNewUrlParser: true, 
    useUnifiedTopology: true

}).then(()=>console.log("mongodb connected ")).catch((e)=>console.log('error',e))

