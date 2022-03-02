const express = require("express");
const cors = require("cors");

const app = express();
const path = require('path');

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

const dotenv = require('dotenv');
dotenv.config();

// app.use(cors(corsOptions));

app.use(cors());
app.options('*', cors());

// parse requests of content-type - application/json
app.use(express.json({ limit: '25mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

// simple route
app.use(express.static(path.join(__dirname, '../front/build')));

require("./app/routes/history.routes")(app);
require("./app/routes/news.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/utils.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
