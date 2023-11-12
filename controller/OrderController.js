import {OrderModel} from "/model/OrderModel.js";
import {customerDB, itemDB, orderDB} from "/db/DB.js";
import {ItemModel} from "/model/ItemModel.js";

let cusRowIndex = null;
let itemRowIndex = null;
let total = 0;
let subTotal = 0;
let sum = 0;
let tempItems = [];
let addedItems = [];

const loadAddItemData = ()=>{
    $("#orderTableBody").html("");
    addedItems.map((item) => {
        $("#orderTableBody").append(`
                    <tr>
                        <td> ${item.code} </td>
                        <td> ${item.description} </td>
                        <td> ${item.price} </td>
                        <td> ${item.qty} </td>
                        <td> ${item.price * item.qty} </td>
                    </tr>
    `   );
    })
}

const loadIdDate = () =>{
    if(orderDB.length === 0){
        $("#orderId").val("OD001");
    }else{
        $("#orderId").val(generateNewId(orderDB[orderDB.length - 1].id));
    }

    $("#date").val(new Date().toLocaleDateString('en-GB'));
};

loadIdDate();


export const loadCustomers = () => {

    $("#orderCusId").empty();
    customerDB.map((orderCusId) => {
        $("#orderCusId").append(`<option value="${orderCusId.id}">${orderCusId.id}</option>`);
    });
};

/*export const loadCustomers = () => {
    $("#orderCusId").empty();
    customerDB.forEach((orderCusId) => {
        $("#orderCusId").append(`<option value="${orderCusId.id}">${orderCusId.id}</option>`);
    });
};*/


export const loadItems = () => {

    $("#orderItemId").empty();
    itemDB.map((orderItemId) => {
        $("#orderItemId").append(`<option value="${orderItemId.code}">${orderItemId.code}</option>`);
    });
};


$("#customerSelector").on('click','select', function (){
/*$("#customerSelector").on('change', 'select', function () {*/
    cusRowIndex = customerDB.findIndex(customer => customer.id === $(this).val());
    if(cusRowIndex === -1) return;
    $("#orderCustName").val( customerDB[cusRowIndex].name );
    $("#cusAddress").val( customerDB[cusRowIndex].address );
    $("#cusContact").val( customerDB[cusRowIndex].contact );
});


$("#itemSelector").on('click','select', function (){
    itemRowIndex = itemDB.findIndex(item => item.code === $(this).val());
    if(itemRowIndex === -1) return;
    $("#orderItemCode").val( itemDB[itemRowIndex].description );
    $("#orderItemPrice").val( itemDB[itemRowIndex].price );
    $("#qty-on-hand").val( itemDB[itemRowIndex].qty );
});


$("#add-item-btn").on('click', ()=>{
    let code = $("#orderItemCode").val(),
        description = $("#orderItemDesc").val(),
        price = Number.parseFloat($("#orderItemPrice").val()),
        qty = Number.parseInt($("#orderQty").val()),
        itemTotal = price * qty;

    if(qty > itemDB[itemRowIndex].qty || !qty) {
        showErrorAlert("Please enter a valid qty..Need to be lower than or equal to qty on hand");
        return;
    }

    let existingItem = addedItems.findIndex(item => item.code === code);
    console.log("index : " + existingItem);

    if(existingItem < 0){
        addedItems.push(new ItemModel(code, description, price, qty, itemTotal));
    }else {
        addedItems[existingItem].qty += qty;
    }
    loadAddItemData();

    tempItems.push(itemDB[itemRowIndex]);
    itemDB[itemRowIndex].qty -= qty;
    $("#qty-on-hand").val( itemDB[itemRowIndex].qty );
    sum += itemTotal;
    $("#sum").text(`Total: Rs. ${sum}`);
});



$("#cash").on('input', ()=>{
    console.log(Number.parseFloat($("#cash").val()));
    console.log(Number.parseFloat($("#subTotal").text().slice(15)));
    $("#balance").val(Number.parseFloat($("#cash").val()) - Number.parseFloat($("#subTotal").text().slice(15)));
})

$("#discount").on('input', () => {
    let subTotals = Number.parseFloat($("#sum").text().slice(11)); 
    let discount = Number.parseFloat($("#discount").val()) || 0; 
    let discountedTotal = subTotals - (subTotals * discount / 100); 
    $("#subTotal").text(`Sub Total: Rs. ${discountedTotal.toFixed(2)}`); 
});

$("#order-btn").on('click', (e)=>{
    e.preventDefault()
    sum =0;
    console.log("ordered");

    let orderId = $("#orderId").val(),
        date = $("#date").val(),
        customer = $("#orderCusId").val(),
        items = addedItems,
        total = Number.parseFloat($("#subTotal").text().slice(15)),
        discount = Number.parseFloat($("#discount").val());

    if(checkValidation(orderId, date, customer, items, total, discount)){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Place Order!'
        }).then((result) => {
            if (result.isConfirmed) {

                let order = new OrderModel(orderId, date, customer, items, discount, total);
                orderDB.push(order);

                console.log(order);

                $("#balance").val(Number.parseFloat($("#cash").val()) - total);

                $("#order-section form").trigger('reset');
                $("select").val("");
                loadIdDate();
                addedItems = [];
                loadAddItemData();
                Swal.fire(
                    `Rs: ${total}`,
                    'The Order has been placed!',
                    'success'
                )
            }
        })
    }
    $("#subTotal").text('SubTotal: Rs.000.00');
    $("#sum").text('Total: Rs.000.00');
});




function checkValidation(orderId, date, customer, items, total, discount) {
    if(!customer){
        showErrorAlert("Please select a customer to place order");
        return false;
    }
    if(items.length === 0){
        showErrorAlert("Please select a item/items to place order");
        return false;
    }
    if(!$("#cash").val()){
        showErrorAlert("Please enter the cash amount");
        return false;
    }
    if((Number.parseFloat($("#cash").val()) - total) < 0){
        showErrorAlert("The cash is not enough to pay the order!!!");
        return false;
    }
    return true;
}


function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(2), 10);
    const newNumber = lastNumber + 1;
    return "OD" + newNumber.toString().padStart(3, "0");
}


function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}