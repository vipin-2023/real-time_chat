const mongoose = require("mongoose");

const url = `mongodb+srv://vipincpy123:vipin123@cluster0.2wghbnp.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url,{
    useNewUrlParser: true, 
    useUnifiedTopology: true

}).then(()=>console.log("mongodb connected ")).catch((e)=>console.log('error',e))