'use strict';

function log(txt) {
    if (true) {
        var d = new Date();
        var t = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        console.log(t + ' ' + txt);
    }
}

log('Initializing...');

require("dotenv").config();

const db = require("./config/db");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
//const cookieparser = require("cookie-parser");
//app.use(cookieparser());

const app = express();
app.use(cors({
  //'allowedHeaders': ['sessionId', 'Content-Type','Authorization'],
  //'exposedHeaders': ['sessionId','Authorization'],
  //'origin': '*',
  //'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //'preflightContinue': false,
  //'credentials': true 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/register", async (req, res) => {
  log('Calling register')
  try {
      
    const user = req.body;

    // Validate user input
    if (!(user.email && user.password && user.first_name && user.last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    const oldUser = await db.findOne(user.email);
      
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    user.password = await bcrypt.hash(user.password, 10); 
      
    await db.createUser(user);


    // Create token
    const email = user.email
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );
      
    // save user token
    user.token = token;

    res.send(user);

  } catch (err) {
    console.log(err);
  }

});

app.post("/login", async (req, res) => {
log('Calling login: ')
  try {

    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
      
    const user = await db.findOne(email);
      
    const passwordOK = await bcrypt.compare(password, user.password);

    if (user &&  passwordOK) {
        
        const token = jwt.sign(

            { user_id: user.user_id },
            process.env.TOKEN_KEY,
            {noTimestamp:true, expiresIn: "6h"}
        );
                
        user.token = token;

        res.send(user);     
        
    } else {
        res.status(400).send("Invalid Credentials");
    }
      
  } catch (err) {
    console.log(err);
  }

});

app.post("/addWorkItem", auth, async (req, res) => {
  log('Calling addWorkItem: ')
  try {

    const { table, idField, id, name } = req.body;

    if (!name) {
      res.status(400).send("All input is required");
    }
    
    if (table == 'programmes'){
        const prog_id = await db.addProgramme(name, 'default programme description');    
        await db.addProgrammeAsgm(prog_id, req.user.user_id);
    } else {
        await db.addWorkItem(table, idField, id, name, '')
    }
      
    const programmes = await db.getUserProgrammes(req.user.user_id);
    res.send(programmes[0]);   
     
  } catch (err) {
    console.log(err);
  }

});

app.post("/deleteWorkItem", auth, async (req, res) => {
  log('Calling deleteWorkItem: ')
  try {

    const { table, idField, id } = req.body;
      
    await db.deleteWorkItem(table, idField, id);
      
    const programmes = await db.getUserProgrammes(req.user.user_id);
    res.send(programmes[0]);   
     
  } catch (err) {
    console.log(err);
  }

});

app.post("/editWorkItem", auth, async (req, res) => {
  log('Calling editWorkItem: ')
  try {

    const { table, idField, id, name, description } = req.body;
      
    await db.editWorkItem(table, idField, id, name, description);
      
    const programmes = await db.getUserProgrammes(req.user.user_id);
    res.send(programmes[0]);   
     
  } catch (err) {
    console.log(err);
  }

});

app.post("/updateStatus", auth, async (req, res) => {
  log('Calling updateStatus: ')
  try {

    const { status, id } = req.body;
      
    await db.updateStatus(status, id);
      
    const programmes = await db.getUserProgrammes(req.user.user_id);
    res.send(programmes[0]);   
     
  } catch (err) {
    console.log(err);
  }

});

app.post("/getDetail", auth, async (req, res) => {
  log('Calling getDetail: ')
  try {

    const { table, idField, id } = req.body;
      
    const detail = await db.getDetail(table, idField, id);

    res.send(detail);   
     
  } catch (err) {
    console.log(err);
  }

});

app.get("/getScope", auth,  async (req, res) => {
    log('Calling welcome')
    const programmes = await db.getUserProgrammes(req.user.user_id);
    res.send(programmes[0]);  
});

app.get("/getCurrentUser", auth,  async (req, res) => {
    log('Calling getCurrentUser')
    const users = await db.getCurrentUser(req.user.user_id);
    res.send(users[0]);  
});

app.use("*", (req, res) => {
  log('Calling use')
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;



