"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '/../../.env' });
const router = express_1.default.Router();
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});
//SENDS ALL MEMBERS
router.get("/", (req, res) => {
    //no need to change to query as it is read operation and createdOn and modifiedOn is not to be displayed on client side
    const query = `SELECT E.id, E."firstName", E."middleName", E."lastName", E.email, E."phoneNumber", E.address, E.role,E.name as "customerName" FROM (SELECT users.*, customers.name  FROM users INNER JOIN customers ON users."customerId"=customers.id) as E  ORDER BY E.id;`;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
});
//SEND A SPECIFIC MEMEBER 
router.get("/:id", (req, res) => {
    let id = req.params.id;
    //no need to change to query as it is read operation and createdOn and modifiedOn is not to be displayed on client side
    const query = `SELECT E.id, E."firstName", E."middleName", E."lastName", E.email, E."phoneNumber", E.address, E.role,E.name as "customerName" FROM (SELECT users.*, customers.name  FROM users INNER JOIN customers ON users."customerId"=customers.id) as E where E.id=${id}; `;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json(result.rows);
    });
});
//ADD MEMBER
router.post("/", (req, res) => {
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
    if (!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.phoneNumber || newMember.role < 0 || newMember.role > 2 || !newMember.address || !newMember.customerName) {
        res.status(400).json({ message: `Give Correct Input` });
        console.log(newMember);
        return;
    }
    if (newMember.phoneNumber.length !== 10) {
        res.status(400).json({ message: `Phone Number must be 10 digits` });
        return;
    }
    else {
        pool.query(`SELECT id FROM users where "phoneNumber" ='${newMember.phoneNumber}'`, (err, result) => {
            if (err) {
                throw err;
            }
            if (result.rows.length !== 0) {
                //method not allowed: The server has received and recognized the request, but has rejected the specific request method
                res.status(405).json({ message: `User Already Exists` });
                return;
            }
            else {
                const queryValidationRole = `SELECT key from role where key =${newMember.role};`;
                pool.query(queryValidationRole, (err, resultRole) => {
                    if (err) {
                        throw err;
                    }
                    if (resultRole.rows.length == 0) {
                        res.status(400).json({ message: `User Role does not exist !` });
                        return;
                    }
                    else {
                        const queryValidationCustomer = `SELECT id from customers where LOWER(name)=LOWER('${newMember.customerName}');`;
                        pool.query(queryValidationCustomer, (err, resultCustomer) => {
                            if (err) {
                                throw err;
                            }
                            if (resultCustomer.rows.length == 0) {
                                res.status(400).json({ message: `Customer does not exist !` });
                                return;
                            }
                            else {
                                //MODIFIED QUERY
                                const query = `INSERT into users ("firstName", "middleName", "lastName", email, "phoneNumber", role, address, "customerId", "createdOn") VALUES ('${newMember.firstName}','${newMember.middleName}','${newMember.lastName}','${newMember.email}','${newMember.phoneNumber}',${newMember.role},'${newMember.address}','${resultCustomer.rows[0].id}',CURRENT_TIMESTAMP);`;
                                pool.query(query, (err, result) => {
                                    if (err) {
                                        throw err;
                                    }
                                    res.status(201).json({ message: `Added User Successfully !`, addedRecord: newMember });
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
            res.status(404).json({ message: `User Does Not Exists`, success: 0 }); //404 - Requested for resource which doesn't exist
            return;
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
                res.status(400).json({ message: `Phone Number must be 10 digits`, success: 0 });
                return;
            }
            else {
                const queryValidationRole = `SELECT key from role where key=${role};`;
                pool.query(queryValidationRole, (err, resultRole) => {
                    if (err) {
                        throw err;
                    }
                    if (resultRole.rows.length == 0) {
                        //405 - method not allowed
                        res.status(405).json({ message: `User Role does not exist !`, success: 0 });
                        return;
                    }
                    else {
                        const queryValidationCustomer = `SELECT id from customers where LOWER(name)=LOWER('${customerName}');`;
                        pool.query(queryValidationCustomer, (err, resultCustomer) => {
                            if (err) {
                                throw err;
                            }
                            if (resultCustomer.rows.length == 0) {
                                //405 - method not allowed
                                res.status(405).json({ message: `Customer does not exist !`, success: 0 });
                                return;
                            }
                            else {
                                //MODIFIED QUERY
                                const query = `UPDATE users SET "firstName"='${firstName}', "middleName"='${middleName}', "lastName"='${lastName}', email='${email}', "phoneNumber"='${phoneNumber}', role=${role}, address='${address}', "customerId"='${resultCustomer.rows[0].id}', "modifiedOn"=CURRENT_TIMESTAMP where id=${id};`;
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
                                        },
                                        success: 1
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
            //404 - request for a resource that does not exist
            res.status(404).json({ message: `User Does Not Exists` });
            return;
        }
        else {
            const query = `DELETE from users where id=${id};`;
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
//# sourceMappingURL=users.js.map