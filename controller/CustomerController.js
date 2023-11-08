import {customerDB} from "../db/DB";
import {CustomerModel} from "../model/CustomerModel";

var row_index = null;

const loadId = () =>{
    if (customerDB.length === 0){
        $("#cust_id").val("C001");
    }else{
        $("#cust_id").val(generateNewId(customerDB[customerDB.length - 1].id));
    }
};

loadId();

const loadCustomerData = () => {
    $('#cusTableBody').html(""); // make tbody empty
    customerDB.map((customer) => {
        $("#cusTableBody").append(<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.contact}</td></tr>);
    });
};



$(".customer").on('click', ()=> loadCustomerData());

// submit
$("#cus_saveBtn").on('click', () => {
    console.log("ABC")
    let id = $("#cust_id").val(),
        name = $("#cust_name").val(),
        address = $("#cust_address").val(),
        contact = $("#cust_contact").val();

    if(!checkValidation(id, name, address, contact)) return;

    let customer = new CustomerModel(id, name, address, contact);
    customerDB.push(customer);

    loadCustomerData();
    $("#cus_clearBtn").click();
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Customer has been saved',
        showConfirmButton: false,
        timer: 1500
    })
});

//search
$("#cusTableBody").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#cust_id").val(selectedId);
    $("#cust_name").val($(this).find("td:nth-child(2)").text());
    $("#cust_address").val($(this).find("td:nth-child(3)").text());
    $("#cust_contact").val($(this).find("td:nth-child(4)").text());

    row_index = customerDB.findIndex((customer => customer.id === selectedId));
});

// update
$("#cus_updateBtn").on('click', () => {
    let id = $("#cust_id").val(),
        name = $("#cust_name").val(),
        address = $("#cust_address").val(),
        contact = $("#cust_contact").val();

    if(!checkValidation(id, name, address, contact)) return;

    customerDB[row_index].id = id;
    customerDB[row_index].name = name;
    customerDB[row_index].address = address;
    customerDB[row_index].salary = contact;

    loadCustomerData();

    $("#cus_clearBtn").click();
    loadId();
    row_index = null;
    Swal.fire({
        icon: 'success',
        title: 'Customer has been updated',
        showConfirmButton: false,
        timer: 1500
    })
});

// delete
$("#cus_deleteBtn").on('click', () => {
    if (row_index == null) return;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete customer!'
    }).then((result) => {
        if (result.isConfirmed) {
            customerDB.splice(row_index, 1);
            loadCustomerData();
            $("#cus_clearBtn").click();
            loadId();
            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            )
        }
    })
});

//validation
function checkValidation(id, name, address, contact){
    console.log(id);
    if(!/^C\d{3}$/.test(id)){ //chekc ID
        showErrorAlert("Please enter a valid ID!")
        return false;
    }
    if(!name){ //check name
        showErrorAlert("Please enter a valid name!");
        return false;
    }
    if(!address){ //check address
        showErrorAlert("Please enter a valid address!");
        return false;
    }
    if(!contact){ //check address
        showErrorAlert("Please enter a valid Contact!");
        return false;
    }
    return true;
}

//showErrorAlert
function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

//generateNewID
function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(1), 10);
    const newNumber = lastNumber + 1;
    return "C" + newNumber.toString().padStart(3, "0");
}

$("#cus_clearBtn").on('click', ()=>{
    setTimeout(loadId, 10);
})