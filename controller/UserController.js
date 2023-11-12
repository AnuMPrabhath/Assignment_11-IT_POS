import {userDB} from "../db/DB.js";
import {UserModel} from "../model/UserModel.js";

function validUsers() {
    userDB.push(new UserModel("anushka", "anushka"));
    userDB.push(new UserModel("prabhath", "prabhath"));
}
validUsers();

$("#signInBtn").on('click', () => {
    console.log("user");
    userDB.map((user) => {
        if (user.username === $("#userName").val() && user.password === $("#password").val()){
            $("#loginSection").css("display", "none");
            $("#dashboardSection").css("display", "block");
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Enter correct username & password!!",
            });
        }
    });
});