import {userDB} from "../db/DB.js";
import {UserModel} from "../model/UserModel.js";
function validUsers() {
    userDB.push(new UserModel("anushka", "anushka"));
    userDB.push(new UserModel("prabhath", "prabhath"));
}
validUsers();

$("#signInBtn").on('click', () => {
    userDB.map((user) => {
        if (user.username === $("#userName") & user.password === $("#password")){
            displayNoneSections();
            $("#dashboardSection").css("display", "block");

        }
    });

    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Enter correct username & password!!",
    });
});