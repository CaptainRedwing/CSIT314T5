import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "../backend/routes/login.js"
import userAdminRoute from "../backend/routes/userAdmin.js"

dotenv.config();

const app = express();
const PORT = 3000;


const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use('/api/login', loginRoute);



app.use((err,req,res,next)=>{
  const statusCode = err.statusCode|| 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ error : message});
});

app.listen(PORT, () =>{
  console.log(`Listening on port ${PORT}`);
});