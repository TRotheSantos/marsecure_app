const express = require("express"); //initialisation module express

const app = express(); //initalisation de l'application web
//const cors = require('cors');

const business = require("../business/business");
var bodyParser = require("body-parser");
const { getAllStreets } = require("../data/datalayer");

const apiServ = {
    start: function (port) {
        app.use(express.json());

        // Configure CORS middleware
        //app.use(cors());

        app.use(bodyParser.urlencoded({ extended: false }));

        // parse application/json
        app.use(bodyParser.json());

        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Methods",
                "GET, PUT, POST, DELETE"
            );
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
            next();
        });

        //donner tous les clients
        app.get("/api/entries", function (req, res) {
            const number = req.query.number;
            const page = req.query.page;
            const resEntries = business.getEntries(number, page);
            console.log(resEntries);
            res.json(resEntries);
        });

        //donner tous les rues
        app.get("/api/streets", function (req, res) {
            const streets = getAllStreets;
            console.log(streets);
            res.json(streets);
        });

        app.post("/api/entries", function (req, res) {
            const total = business.getEntries();
            let id = total.total + 1;
            var d = new Date();
            var date =
                d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            var hours =
                d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            var fullDate = date + " " + hours;

            const newEntry = {
                id: id,
                street: req.body.street,
                subject: req.body.subject,
                description: req.body.description,
                date: fullDate,
                coord: {
                    lat: Number(req.body.lat),
                    lng: Number(req.body.lng),
                },
            };
            console.log(newEntry);
            const updatedEntries = business.addEntries(newEntry);

            res.json(updatedEntries);
        });

        app.get("/api/entries/street", function (req, res) {
            const targetStreet = req.query.street;

            // Assuming you have a function to retrieve all entries
            const allEntries = business.getAllEntries();

            // Filter the entries based on the target street value
            const filteredEntries = allEntries.filter(
                (entry) => entry.street === targetStreet
            );

            res.json(filteredEntries);
        });

        app.listen(port, function () {
            console.log("Server running on port " + port);
        });
    },
};
module.exports = apiServ;
