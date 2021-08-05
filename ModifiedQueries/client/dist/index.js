"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import * as dotenv from 'dotenv';
// dotenv.config();
var Role;
(function (Role) {
    Role[Role["SUPERADMIN"] = 0] = "SUPERADMIN";
    Role[Role["ADMIN"] = 1] = "ADMIN";
    Role[Role["SUBSCRIBER"] = 2] = "SUBSCRIBER";
})(Role || (Role = {}));
;
const baseUrl = `http://localhost:3000/users/`;
//in strict mode need to tell ts that it won't be Null.
class User {
}
//DECORATOR FACTORY
function FormatDate() {
    return function (target, name, descriptor) {
        const dateTime = document.getElementById("dateTime");
        dateTime.innerHTML = new Date().toLocaleString();
        setInterval(function () {
            dateTime.innerHTML = new Date().toLocaleString();
        }, 1000);
    };
}
//MODEL CLASS FOR USER ENTRY
class Crud {
    constructor() {
        this.items = [];
    }
    add(object) {
        this.items.push(object);
    }
    update(id, index, updatedObject) {
        editUser(id, updatedObject).then((response) => {
            if (response.success) {
                this.items[index] = response.updatedRecord;
            }
            alert(response.message);
            showTable();
        }).catch((err) => {
            console.log(err);
            alert("Unexpected Error Occured !");
        });
    }
    delete(id, index, object) {
        return new Promise((resolve, reject) => {
            let success = false;
            //make api call to delete data 
            deleteUser(id).then((response) => {
                alert(response.message);
                success = true;
                resolve(success);
            }).catch(() => {
                alert("Unexpected Error Occured !");
            });
        });
    }
}
__decorate([
    FormatDate()
], Crud.prototype, "add", null);
let crudObject = new Crud(); //array of objects to be displayed on frontend
//API CALLS ========================================================================================================================================
function addUser(firstName, middleName, lastName, email, phoneNumber, role, address, customerName) {
    return __awaiter(this, void 0, void 0, function* () {
        let newMember = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            role: role,
            address: address,
            customerName: customerName
        };
        let response = yield fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMember)
        });
        let data = yield response.json();
        return data;
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(baseUrl);
        let users = yield response.json();
        return users; // same as Promise.resolve(users)
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(baseUrl + id, {
            method: 'DELETE'
        });
        let data = yield response.json();
        return data;
    });
}
function editUser(id, object) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(baseUrl + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        });
        let data = yield response.json();
        console.log(data);
        return data;
    });
}
//=====================================================================================================================================================
//MAKES THE CONTENT OF CURRENT ROW EDITABLE
function editRow(no) {
    let currentRow = document.getElementById("row" + no);
    currentRow.style.background = "yellow";
    //SHOW SAVE & CANCEL BUTTON
    let saveButton = document.getElementById("saveButtonRow" + no);
    let cancelButton = document.getElementById("cancelButtonRow" + no);
    let headerSave = document.getElementById("headerSave");
    let headerCancel = document.getElementById("headerCancel");
    saveButton.style.display = "";
    cancelButton.style.display = "";
    headerSave.style.display = "";
    headerCancel.style.display = "";
    //MAKE ROW EDITABLE 
    let rowFname = document.getElementById("row" + no + "Fname");
    let rowMname = document.getElementById("row" + no + "Mname");
    let rowLname = document.getElementById("row" + no + "Lname");
    let rowEmail = document.getElementById("row" + no + "Email");
    let rowPhone = document.getElementById("row" + no + "Phone");
    let rowRole = document.getElementById("row" + no + "SelectRole");
    let rowAddress = document.getElementById("row" + no + "Address");
    let rowCustomerName = document.getElementById("row" + no + "CustomerName");
    rowFname.setAttribute("contenteditable", "true");
    rowMname.setAttribute("contenteditable", "true");
    rowLname.setAttribute("contenteditable", "true");
    rowEmail.setAttribute("contenteditable", "true");
    rowPhone.setAttribute("contenteditable", "true");
    rowRole.disabled = false;
    rowAddress.setAttribute("contenteditable", "true");
    rowCustomerName.setAttribute("contenteditable", "true");
}
function getCurrentRowData(no) {
    let rowId = document.getElementById("row" + no + "Id").innerHTML;
    let rowFname = document.getElementById("row" + no + "Fname").innerHTML;
    let rowMname = document.getElementById("row" + no + "Mname").innerHTML;
    let rowLname = document.getElementById("row" + no + "Lname").innerHTML;
    let rowEmail = document.getElementById("row" + no + "Email").innerHTML;
    let rowPhone = document.getElementById("row" + no + "Phone").innerHTML;
    let rowRole = +document.getElementById("row" + (no) + "SelectRole").value;
    let rowAddress = document.getElementById("row" + no + "Address").innerHTML;
    let rowCustomerName = document.getElementById("row" + no + "CustomerName").innerHTML;
    if (rowRole === Role.SUPERADMIN)
        rowRole = 0;
    else if (rowRole === Role.ADMIN)
        rowRole = 1;
    else
        rowRole = 2;
    let object = {
        id: parseInt(rowId),
        firstName: rowFname,
        middleName: rowMname,
        lastName: rowLname,
        email: rowEmail,
        phoneNumber: rowPhone,
        role: rowRole,
        address: rowAddress,
        customerName: rowCustomerName
    };
    return object;
}
//function responsible for creating table from CrudObject and displaying it to user. 
function showTable() {
    console.log('table');
    let table = document.createElement("table"); // TS knows that only a generic html element is returned by createElement, hence we need to specify
    table.className = 'table table-hover';
    // EXTRACT VALUE FOR HTML HEADER. 
    let tr = table.insertRow(-1);
    let headerElements = ["id", "First Name", "Middle Name", "Last Name", "Email", "Phone Number", "Role", "Address", "Customer Name"];
    for (let i = 0; i < headerElements.length; i++) {
        let th = document.createElement("th"); // TABLE HEADER.
        th.innerHTML = headerElements[i];
        tr.appendChild(th);
    }
    let thEdit = document.createElement("th"); // TABLE HEADER.
    thEdit.innerHTML = "Edit";
    tr.appendChild(thEdit);
    let thDelete = document.createElement("th"); // TABLE HEADER.
    thDelete.innerHTML = "Delete";
    tr.appendChild(thDelete);
    let thSave = document.createElement("th"); // TABLE HEADER. 
    thSave.innerHTML = "Save";
    tr.appendChild(thSave);
    let thCancel = document.createElement("th"); // TABLE HEADER. 
    thCancel.innerHTML = "Cancel";
    tr.appendChild(thCancel);
    thSave.style.display = "none";
    thCancel.style.display = "none";
    thSave.id = "headerSave";
    thCancel.id = "headerCancel";
    //populate from Crud object items data 
    console.log(crudObject.items);
    for (let i = 0; i < crudObject.items.length; i++) {
        tr = table.insertRow(-1);
        tr.id = "row" + (i);
        let cell1 = tr.insertCell(-1);
        let id = crudObject.items[i].id;
        cell1.innerHTML = `${id}`;
        cell1.id = "row" + (i) + "Id";
        let cell2 = tr.insertCell(-1);
        let fname = crudObject.items[i].firstName;
        cell2.innerHTML = fname;
        cell2.id = "row" + (i) + "Fname";
        let cell3 = tr.insertCell(-1);
        let mname = crudObject.items[i].middleName;
        ;
        cell3.innerHTML = mname;
        cell3.id = "row" + (i) + "Mname";
        let cell4 = tr.insertCell(-1);
        let lname = crudObject.items[i].lastName;
        cell4.innerHTML = lname;
        cell4.id = "row" + (i) + "Lname";
        let cell5 = tr.insertCell(-1);
        let email = crudObject.items[i].email;
        cell5.innerHTML = email;
        cell5.id = "row" + (i) + "Email";
        let cell6 = tr.insertCell(-1);
        let phone = crudObject.items[i].phoneNumber;
        cell6.innerHTML = phone;
        cell6.id = "row" + (i) + "Phone";
        let cell7 = tr.insertCell(-1);
        cell7.id = "row" + (i) + "Role";
        let selectRoleList = document.createElement("select");
        selectRoleList.id = "row" + (i) + "SelectRole";
        selectRoleList.setAttribute("disabled", "true");
        let role = +crudObject.items[i].role;
        cell7.appendChild(selectRoleList);
        for (let i in Role) {
            if (Number.isInteger(Role[i])) {
                let option = document.createElement("option");
                option.value = Role[i];
                option.text = i;
                selectRoleList.appendChild(option);
            }
        }
        selectRoleList.selectedIndex = role;
        let cell8 = tr.insertCell(-1);
        let add = crudObject.items[i].address;
        cell8.innerHTML = add;
        cell8.id = "row" + (i) + "Address";
        let cell9 = tr.insertCell(-1);
        let customer = crudObject.items[i].customerName;
        cell9.innerHTML = customer;
        cell9.id = "row" + (i) + "CustomerName";
        cell2.className = "editable";
        cell3.className = "editable";
        cell4.className = "editable";
        cell5.className = "editable";
        cell6.className = "editable";
        cell7.className = "editable";
        cell8.className = "editable";
        cell9.className = "editable";
        //BUTTONS ON EACH ROW
        //EDIT
        let cellForEditButton = tr.insertCell(-1);
        let editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.innerHTML = 'Edit';
        cellForEditButton.appendChild(editButton);
        editButton.addEventListener('click', function () { editRow(i); });
        //DELETE
        let cellForDeleteButton = tr.insertCell(-1);
        let deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.innerHTML = 'Delete';
        cellForDeleteButton.appendChild(deleteButton);
        deleteButton.addEventListener('click', function () {
            let deleteObject = getCurrentRowData(i);
            //Finding index of  object to be deleted in items Array
            let index = -1;
            for (let i = 0; i < crudObject.items.length; i++) {
                if (crudObject.items[i].id === id) {
                    index = i;
                    break;
                }
            }
            crudObject.delete(id, index, deleteObject).then(value => {
                getUsers().then(usersArray => {
                    crudObject.items = usersArray;
                    showTable();
                }).catch(() => {
                    alert("Unexpected Error Occured !");
                });
            }).catch(() => {
                alert("Unexpected Error Occured !");
            });
        });
        //SAVE
        let cellForSaveButton = tr.insertCell(-1);
        let saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.innerHTML = 'Save';
        cellForSaveButton.className = 'hiddenElements';
        cellForSaveButton.id = 'saveButtonRow' + i;
        cellForSaveButton.appendChild(saveButton);
        cellForSaveButton.style.display = "none";
        saveButton.addEventListener('click', function () {
            let updatedRowObject = getCurrentRowData(i);
            //Finding index of previous object in items Array
            let index = -1;
            for (let i = 0; i < crudObject.items.length; i++) {
                if (crudObject.items[i].id === id) {
                    index = i;
                    break;
                }
            }
            crudObject.update(id, index, updatedRowObject);
            let saveButton = document.getElementById("saveButtonRow" + i);
            let cancelButton = document.getElementById("cancelButtonRow" + i);
            let headerSave = document.getElementById("headerSave");
            let headerCancel = document.getElementById("headerCancel");
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            headerSave.style.display = "none";
            headerCancel.style.display = "none";
        });
        //CANCEL
        let cellForCancelButton = tr.insertCell(-1);
        let cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.innerHTML = 'Cancel';
        cellForCancelButton.className = 'hiddenElements';
        cellForCancelButton.id = 'cancelButtonRow' + (i);
        cellForCancelButton.appendChild(cancelButton);
        cellForCancelButton.style.display = "none";
        cancelButton.addEventListener('click', function () { showTable(); });
    }
    let divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    let loadButton = document.getElementById("showDataButton");
    loadButton.value = "Refresh";
}
//function which is called when load data button is clicked
function loadData() {
    getUsers()
        .then(usersArray => {
        crudObject.items = [];
        usersArray.forEach(function (object) { crudObject.add(object); }); //pushing objects obtained via api into array
        showTable();
    })
        .catch(() => {
        alert("Unexpected Error Occured !");
    });
}
//function which is called when new user form is submitted. Function gets input from form and send to addUser function to make post request
function addUserSubmit(e) {
    e.preventDefault();
    let firstName = document.getElementById("addUserFirstName").value;
    let middleName = document.getElementById("addUserMiddleName").value;
    let lastName = document.getElementById("addUserLastName").value;
    let email = document.getElementById("addUserEmail").value;
    let phoneNumber = document.getElementById("addUserPhoneNumber").value;
    let role = +document.getElementById("addUserRole").value;
    let address = document.getElementById("addUserAddress").value;
    let customerName = document.getElementById("addUserCustomerName").value;
    if (role === Role.SUPERADMIN)
        role = 0;
    else if (role === Role.ADMIN)
        role = 1;
    else
        role = 2;
    addUser(firstName, middleName, lastName, email, phoneNumber, role, address, customerName).then((response) => {
        alert(response.message);
    }).then(() => {
        getUsers().then((usersArray) => {
            crudObject.items = usersArray;
            showTable();
        });
    }).catch(() => {
        alert("Unexpected Error Occured !");
    });
    return false;
    //false because we don't want to submit form anywhere
}
