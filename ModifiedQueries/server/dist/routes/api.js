"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const router = express_1.default.Router();
// const Pool = require('pg').Pool
const pool = new pg_1.Pool({
    user: 'barleen',
    host: 'localhost',
    database: 'barleen',
    password: '123456',
    port: 5432,
});
//SENDS ALL MEMBERS
router.get("/", (req, res) => {
    const query = `SELECT E.id, E."firstName", E."middleName", E."lastName", E.email, E."phoneNumber", E.address, E.name as "customerName", role.name as role FROM (SELECT users.*, customers.name  FROM users INNER JOIN customers ON users."customerID"=customers.id) as E INNER JOIN role on E.role=role.key ORDER BY E.id;`;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result.rows);
        res.status(200).json(result.rows);
    });
});
//SEND A SPECIFIC MEMEBER 
router.get("/:id", (req, res) => {
    let id = req.params.id;
    const query = `SELECT E.id, E."firstName", E."middleName", E."lastName", E.email, E."phoneNumber", E.address, E.name as "customerName", role.name as role FROM (SELECT users.*, customers.name  FROM users INNER JOIN customers ON users."customerID"=customers.id) as E INNER JOIN role on E.role=role.key where E.id = ${id}; `;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result.rows);
        res.status(200).json(result.rows);
    });
});
//ADD MEMBER
router.post("/", (req, res) => {
    console.log("add member");
    const newMember = {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        address: req.body.address,
        customerName: req.body.customerName
    };
    if (!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.phoneNumber || !newMember.role || !newMember.address) {
        console.log(newMember);
        res.status(400).json({ message: `Give Correct Input` });
    }
    if (newMember.phoneNumber.length !== 10) {
        res.status(400).json({ message: `Give Correct Input` });
    }
    else {
        pool.query(`SELECT id FROM users where "phoneNumber" ='${newMember.phoneNumber}'`, (err, result) => {
            if (err) {
                throw err;
            }
            if (result.rows.length !== 0) {
                console.log(result);
                res.status(400).json({ message: `User Already Exists` });
            }
            else {
                const queryValidationRole = `SELECT key from role where LOWER(name)=LOWER('${newMember.role}');`;
                console.log(queryValidationRole);
                pool.query(queryValidationRole, (err, resultRole) => {
                    if (err) {
                        throw err;
                    }
                    if (resultRole.rows.length == 0) {
                        res.status(400).json({ message: `User Role does not exist !` });
                    }
                    else {
                        //console.log(result_outer.rows[0].key);
                        const queryValidationCustomer = `SELECT id from customers where LOWER(name)=LOWER('${newMember.customerName}');`;
                        console.log(queryValidationCustomer);
                        pool.query(queryValidationCustomer, (err, resultCustomer) => {
                            if (err) {
                                throw err;
                            }
                            if (resultCustomer.rows.length == 0) {
                                res.status(400).json({ message: `Customer does not exist !` });
                            }
                            else {
                                const query = `INSERT into users ("firstName", "middleName", "lastName", email, "phoneNumber", role, address, "customerID") VALUES ('${newMember.firstName}','${newMember.middleName}','${newMember.lastName}','${newMember.email}','${newMember.phoneNumber}',${resultRole.rows[0].key},'${newMember.address}','${resultCustomer.rows[0].id}');`;
                                pool.query(query, (err, result) => {
                                    if (err) {
                                        throw err;
                                    }
                                    res.status(200).json({ message: `Added User Successfully !`, addedRecord: newMember });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
//EDIT MEMBER
router.put('/:id', (req, res) => {
    let id = req.params.id;
    pool.query(`SELECT * FROM users where id =${id}`, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.rows.length === 0) {
            res.status(404).json({ message: `User Does Not Exists` });
        }
        else {
            let firstName = req.body.firstName;
            let middleName = req.body.middleName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let phoneNumber = req.body.phoneNumber;
            let role = req.body.role;
            let address = req.body.address;
            let customerName = req.body.customerName;
            if (phoneNumber.length !== 10) {
                res.status(400).json({ message: `Give Correct Input` });
            }
            else {
                const queryValidationRole = `SELECT key from role where LOWER(name)=LOWER('${role}');`;
                console.log(queryValidationRole);
                pool.query(queryValidationRole, (err, resultRole) => {
                    if (err) {
                        throw err;
                    }
                    if (resultRole.rows.length == 0) {
                        res.status(400).json({ message: `User Role does not exist !` });
                    }
                    else {
                        const queryValidationCustomer = `SELECT id from customers where LOWER(name)=LOWER('${customerName}');`;
                        console.log(queryValidationCustomer);
                        pool.query(queryValidationCustomer, (err, resultCustomer) => {
                            if (err) {
                                throw err;
                            }
                            if (resultCustomer.rows.length == 0) {
                                res.status(400).json({ message: `Customer does not exist !` });
                            }
                            else {
                                const query = `UPDATE users SET "firstName"='${firstName}', "middleName"='${middleName}', "lastName"='${lastName}', email='${email}', "phoneNumber"='${phoneNumber}', role='${resultRole.rows[0].key}', address='${address}', "customerID"='${resultCustomer.rows[0].id}' where id=${id};`;
                                console.log(query);
                                pool.query(query, (err, result) => {
                                    if (err) {
                                        throw err;
                                    }
                                    res.status(200).json({
                                        message: `Updated Row with id = ${id} Successfully`, updatedRecord: {
                                            id: id,
                                            firstName: firstName,
                                            middleName: middleName,
                                            lastName: lastName,
                                            email: email,
                                            phoneNumber: phoneNumber,
                                            role: role,
                                            address: address,
                                            customerName: customerName
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});
//DELETE MEMBER
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    pool.query(`SELECT * FROM users where id =${id}`, (error, result) => {
        if (error) {
            throw error;
        }
        if (result.rows.length === 0) {
            res.status(400).json({ message: `User Does Not Exists` });
        }
        else {
            const query = `DELETE from users where id=${id};`;
            console.log(query);
            pool.query(query, (error, result) => {
                if (error) {
                    throw error;
                }
                res.status(200).json({ message: `Deleted User with id = ${id} Successfully !` });
            });
        }
    });
});
module.exports = router;
//# sourceMappingURL=api.js.map