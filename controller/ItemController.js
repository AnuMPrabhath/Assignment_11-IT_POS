import {itemDB} from "../db/DB.js";
import {ItemModel} from "../model/ItemModel.js";

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
        $("#itemTableBody").append(`<tr><td>${item.code}</td><td>${item.description}</td><td>${item.price}</td><td>${item.qty}</td></tr>`);
    });
};

$(".item").on('click', ()=> loadItemData());


$("#item_saveBtn").on('click', (e) => {
    e.preventDefault();
    let code = $("#item_code").val(),
        description = $("#item_des").val(),
        price = Number.parseFloat($("#item_price").val()),
        qty = Number.parseInt($("#item_qty").val());
    console.log(name);
    if(!checkValidation(code, description, price, qty)) return;

    let item = new ItemModel(code, description, price, qty);
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


$("#itemTableBody").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#item_code").val( selectedId );
    $("#item_des").val( $(this).find("td:nth-child(2)").text() );
    $("#item_price").val( Number.parseFloat($(this).find("td:nth-child(3)").text() ) );
    $("#item_qty").val( Number.parseInt( $(this).find("td:nth-child(4)").text() ) );

    row_index = itemDB.findIndex((item => item.code === selectedId));
});


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


function checkValidation(code, description, price, qty){
    console.log(code);
    if(!/^I\d{3}$/.test(code)){ 
        showErrorAlert("Please enter a valid code!")
        return false;
    }
    if(!description){ 
        showErrorAlert("Please enter description!");
        return false;
    }
    if(!/^\d+(\.\d{1,2})?$/.test(price.toString())){ 
        showErrorAlert("Please enter a price for item!");
        return false;
    }
    if(!qty || qty === 0){ 
        showErrorAlert("Please enter a quantity");
        return false;
    }
    return true;
}


function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}


function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(1), 10);
    const newNumber = lastNumber + 1;
    return "I" + newNumber.toString().padStart(3, "0");
}

$("#item_clearBtn").on('click', ()=>{
    setTimeout(loadId, 10);
})