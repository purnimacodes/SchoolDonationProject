import dotenv from "dotenv"
import { app } from "./app.js";  // Import the configured app
import connectdb from "./db/index.js";

dotenv.config({
  path:"./.env"
})


connectdb().then(()=>{
  app.listen(process.env.PORT , ()=>{
    console.log(`server is running at port : ${process.env.PORT}  `);
    
  })
}).catch((err)=>{
  console.log('mongodb connection fail',err);
  
})