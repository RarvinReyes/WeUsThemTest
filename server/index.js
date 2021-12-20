const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const { query } = require("express");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    password: "root",
    host: "localhost",
    database: "test"
});

app.post("/save", (req, res) => {
    const id = req.body.id;
    const firstName = req.body.firstName;
    const profilePicture = req.body.profilePicture;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;
    const phoneNumber = req.body.phoneNumber;

    console.log(req.body);

    try {
        if(id == 0) {
        db.query("insert into contacts (firstname, lastname, profilepicture, emailaddress, phonenumber) "
            + " values (?, ?, ?, ?, ?); ", [firstName, lastName, profilePicture, emailAddress, phoneNumber]
            , (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("values inserted: " + result);
                }
            });
        } else {
            db.query("update contacts set firstname = ?, lastname = ?, profilepicture = ?, emailaddress = ?, phonenumber = ? "
                + " where id = ? ", [firstName, lastName, profilePicture, emailAddress, phoneNumber, id]
                , (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("values inserted: " + result);
                    }
                });
        }
    } catch (err) {
        console.log(err);
    }
});

// was supposed to use get but i didnt have the time to figure out how to pass data thru url
app.post("/getall", (req, res) => {
    let search = req.body.search;
    try {
        let query = "select id, firstname, lastname, CONVERT(profilepicture USING utf8), emailaddress, phonenumber from contacts";
        if(search != null || search.trim() != "") {
            query = "select id, firstname, lastname, CONVERT(profilepicture USING utf8), emailaddress, phonenumber from contacts where "
            + " firstname like ('%"+search+"%') or lastname like ('%"+search+"%') ";
        }
        db.query(query,
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    } catch (err) {
        console.log(err);
    }
});

app.post("/getcontact", (req, res) => {
    let id = req.body.id;
    try {
        db.query("select id, firstname, lastname, CONVERT(profilepicture USING utf8), emailaddress, phonenumber from contacts "
        + " where id = ?", [id],
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    } catch (err) {
        console.log(err);
    }
});

app.post("/delete", (req, res) => {
    let id = req.body.id;
    try {
        db.query("delete from contacts where id = ?", [id],
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    } catch (err) {
        console.log(err);
    }
        
});

app.listen(3001, () => {
    console.log("server is running...");
});

