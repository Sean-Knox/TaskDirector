/*jslint
    es6
*/

var mysql = require('mysql');

const db_conn = require('./conn');

var con = mysql.createConnection(db_conn);

function dropTable(){
  con.query("DROP TABLE users",function (err, result) {
    if (err) throw error;
    return result;
  });
}  

function createTable(){
  con.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY ,first_name varchar(50),last_name varchar(50),email nvarchar(50),password nvarchar(20), token nvarchar(100));",function (err, result) {
    if (err) throw error;
    return result;
  });
}

function createUser(user){
    con.query("INSERT INTO users SET ?", user, function (err, result) {
        if (err) throw error;
        return result;
    });
}

function findOne(email){ 
    return new Promise(function(resolve, reject) {
      con.query("SELECT * FROM users where email = ?", [email], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);         
      }); 
    });
}

function getCurrentUser(user_id){ 
    return new Promise(function(resolve, reject) {
      con.query("select first_name, last_name, email from users where user_id = ?", [user_id], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);         
      }); 
    });
}

function getUserProgrammes(user_id){ 
    return new Promise(function(resolve, reject) {
      con.query("call get_user_scope(?)", [user_id], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);         
      }); 
    });
}

function addProgramme(name, description){ 
    return new Promise(function(resolve, reject) {
      con.query("INSERT INTO programmes (name, description) VALUES (?,?)", [name, description], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result.insertId);         
      }); 
    });
}

function addWorkItem(table, idField, id, name, description){ 
    return new Promise(function(resolve, reject) {
      con.query("INSERT INTO ?? (??, name,  description) VALUES (?,?,?)", [table, idField, id, name, description], function (err, result) {
            if (err) {
                console.log('Error: ' + err);
                return reject(err);
            }
            resolve(result.insertId);         
      }); 
    });
}

function deleteWorkItem(table, idField, id){ 
    return new Promise(function(resolve, reject) {
      con.query("DELETE FROM ?? WHERE ?? = ?", [table, idField, id], function (err, result) {
            if (err) {
                console.log('Error: ' + err);
                return reject(err);
            }
            resolve(result.insertId);         
      }); 
    });
}

function editWorkItem(table, idField, id, name, description){ 
    return new Promise(function(resolve, reject) {
      con.query("UPDATE ?? SET name = ?, description = ? WHERE ?? = ?", [table, name, description, idField, id], function (err, result) {
            if (err) {
                console.log('Error: ' + err);
                return reject(err);
            }
            resolve(result.insertId);         
      }); 
    });
}

function updateStatus(status, id){ 
    return new Promise(function(resolve, reject) {
      con.query("UPDATE tasks SET status = ? WHERE task_id = ?", [status, id], function (err, result) {
            if (err) {
                console.log('Error: ' + err);
                return reject(err);
            }
            resolve(result.insertId);         
      }); 
    });
}

function getDetail(table, idField, id){ 
    return new Promise(function(resolve, reject) {
      con.query("SELECT description FROM ?? WHERE ?? = ?", [table, idField, id], function (err, result) {
            if (err) {
                console.log('Error: ' + err);
                return reject(err);
            }
            resolve(result);         
      }); 
    });
}

function addProgrammeAsgm(prog_id, user_id){ 
    return new Promise(function(resolve, reject) {
      con.query("INSERT INTO programme_asgm (prog_id, user_id) VALUES (?,?)", [prog_id, user_id], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);         
      }); 
    });
}

module.exports = {
    createUser,
    findOne ,
    getUserProgrammes,
    addProgramme,
    addProgrammeAsgm,
    addWorkItem,
    deleteWorkItem,
    editWorkItem,
    updateStatus,
    getDetail,
    getCurrentUser
}