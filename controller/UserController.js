import {userDB} from "../db/DB.js";
import {UserModel} from "../model/UserModel.js";

function validUsers() {
    userDB.push(new UserModel("anushka", "anushka"));
    userDB.push(new UserModel("prabhath", "prabhath"));
}
validUsers();

$("#signInBtn").on('click', () => {
    const enteredUsername = $("#userName").val();
    const enteredPassword = $("#password").val();

    const user = userDB.find((user) => user.username === enteredUsername && user.password === enteredPassword);

    if (user) {
        // Successful login
        $("#loginSection").css("display", "none");
        $("#dashboardSection").css("display", "block");
        $("#userName").val("");
        $("#password").val("");
        Swal.fire({
            icon: 'success',
            title: 'Welcome',
            text: "You are Login In..",
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        // Display an error message if no matching user is found
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Enter correct username & password!!",
        });
    }
});
