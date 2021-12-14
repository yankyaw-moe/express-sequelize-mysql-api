const express = require('express');
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions));

// parse content-type requests -> application/json
app.use(express.json());

// parse content-type requests -> application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and re-sync db');
});


require('./app/routes/tutorial.routes')(app);

// simple route
// app.get('/', (req, res) => {
//     res.json({ message: 'welcome to app'});
// });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})



