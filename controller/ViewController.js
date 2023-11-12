import { loadCustomers } from './OrderController.js';
import { loadItems } from './OrderController.js';

const customerSectionBlock = () => {
    displayNoneSections();
    $("#navBarSection").css("display", "block");
    $("#title").text("CUSTOMER FORM");
    addClassNav();
    $("#customer").addClass("nav-link active");
    $("#customerSection").css("display", "block");
}
const itemSectionBlock = () => {
    displayNoneSections();
    $("#navBarSection").css("display", "block");
    $("#title").text("ITEM FORM");
    addClassNav();
    $("#item").addClass("nav-link active");
    $("#itemSection").css("display", "block");
}
const orderSectionBlock = () => {
    displayNoneSections();
    $("#navBarSection").css("display", "block");
    $("#title").text("ORDER FORM");
    addClassNav();
    $("#order").addClass("nav-link active");
    $("#orderSection").css("display", "block");
    loadCustomers();
    loadItems();
}
export const displayNoneSections = () => {
    $("#loginSection").css("display", "none");
    $("#dashboardSection").css("display", "none");
    $("#navBarSection").css("display", "none");
    $("#customerSection").css("display", "none");
    $("#itemSection").css("display", "none");
    $("#orderSection").css("display", "none");
}
const addClassNav = () => {
    console.log("addClassNav");
    $("#customer").addClass("nav-link");
    $("#item").addClass("nav-link");
    $("#order").addClass("nav-link");
}
displayNoneSections();
$("#loginSection").css("display", "block");

$("#customerBtn").on('click', () => {
    customerSectionBlock();
});

$("#itemBtn").on('click', () => {
    itemSectionBlock();
});

$("#orderBtn").on('click', () => {
    orderSectionBlock();
});

$("#logOutBtn").on('click', () => {
    displayNoneSections();
    $("#loginSection").css("display", "block");
});

$("#navDashBord").on('click', () => {
    displayNoneSections();
    $("#dashboardSection").css("display", "block");
});

$("#navCustomer").on('click', () => {
    customerSectionBlock();
});

$("#navItem").on('click', () => {
    itemSectionBlock();
});

$("#navOrder").on('click', () => {
    orderSectionBlock();
});