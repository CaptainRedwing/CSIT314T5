import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "../backend/routes/login.js";
import userAdminRoute from "../backend/routes/userAdmin.js";
import userProfileRoute from "../backend/routes/userProfile.js";
import serviceCategoriesRoute from "../backend/routes/serviceCategories.js";
import serviceListingRoute from "../backend/routes/serviceListing.js";
import favouriteListingRoute from "../backend/routes/favouriteListing.js";
import matchHistoryRoute from "../backend/routes/matchHistory.js";
import platformReportRoute from "../backend/routes/platformReport.js"

dotenv.config();

const app = express();
const PORT = 3000;


const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use('/api/login', loginRoute);

app.use('/api/userAdmin', userAdminRoute);

app.use('/api/userProfile', userProfileRoute);

app.use('/api/serviceCategories', serviceCategoriesRoute);

app.use('/api/serviceListing', serviceListingRoute);

app.use('/api/favouriteListing', favouriteListingRoute);

app.use('/api/matchHistory', matchHistoryRoute);

app.use('/api/platformReport', platformReportRoute);




app.use((err,req,res,next)=>{
  const statusCode = err.statusCode|| 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ error : message});
});

app.listen(PORT, () =>{
  console.log(`Listening on port ${PORT}`);
});

