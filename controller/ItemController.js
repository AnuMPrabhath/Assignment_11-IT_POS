import {itemDB} from "../db/DB";
import {ItemModel} from "../model/ItemModel";

let row_index = null;

const loadId = () =>{
    if(itemDB.length == 0){
        $("#item_code").val("I001");
    }else{
        $("#item_code").val(generateNewId(itemDB[itemDB.length - 1].id));
    }
};

loadId();

const loadItemData = () => {
    $("#itemTableBody").html("");
    itemDB.map((item) => {
        $("#itemTableBody").append(`<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td><td>${item.qty}</td></tr>`);
    });
};

$(".item").on('click', ()=> loadItemData());

//save
$("#item_saveBtn").on('click', () => {
    console.log("ABC")
    let id = $("#item_code").val(),
        name = $("#item_des").val(),
        price = Number.parseFloat($("#item_price").val()),
        qty = Number.parseInt($("#item_qty").val());

    if(!checkValidation(id, name, price, qty)) return;

    let item = new ItemModel(id, name, price, qty);
    itemDB.push(item);

    loadItemData();
    $("#item_clearBtn").click();
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Item has been saved',
        showConfirmButton: false,
        timer: 1500
    })
});

//search
$("#itemTableBody").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#item_code").val( selectedId );
    $("#item_des").val( $(this).find("td:nth-child(2)").text() );
    $("#item_price").val( Number.parseFloat($(this).find("td:nth-child(3)").text() ) );
    $("#item_qty").val( Number.parseInt( $(this).find("td:nth-child(4)").text() ) );

    row_index = itemDB.findIndex((item => item.id === selectedId));
});

//update
$("#item_updateBtn").on('click', () => {
    let code = $("#item_code").val(),
        description = $("#item_des").val(),
        price = Number.parseFloat($("#item_price").val()),
        qty = Number.parseInt($("#item_qty").val());

    if(!checkValidation(code, description, price, qty)) return;

    itemDB[row_index].code = code;
    itemDB[row_index].description = description;
    itemDB[row_index].price = price;
    itemDB[row_index].qty = qty;

    loadItemData();
    $("#item_clearBtn").click();
    row_index = null;
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Item has been updated',
        showConfirmButton: false,
        timer: 1500
    })
});

//remove
$("#item_deleteBtn").on('click', () => {
    if (row_index == null) return;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            itemDB.splice(row_index, 1);
            loadItemData();
            $("#item_clearBtn").click();
            loadId();
            Swal.fire(
                'Deleted!',
                'Item has been deleted.',
                'success'
            )
        }
    })
});

//validation
function checkValidation(code, description, price, qty){
    console.log(code);
    if(!/^I\d{3}$/.test(id)){ //chekc ID
        showErrorAlert("Please enter a valid code!")
        return false;
    }
    if(!description){ //check description
        showErrorAlert("Please enter description!");
        return false;
    }
    if(!/^\d+(\.\d{1,2})?$/.test(price.toString())){ //check address
        showErrorAlert("Please enter a price for item!");
        return false;
    }
    if(!qty || qty === 0){ //check salary
        showErrorAlert("Please enter a quantity");
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
    return "I" + newNumber.toString().padStart(3, "0");
}

$("#item_clearBtn").on('click', ()=>{
    setTimeout(loadId, 10);
})