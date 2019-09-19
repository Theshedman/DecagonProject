$(document).ready(() => {
   let count = 0;
   $("#close-employees-list").hide();
// post request: create new employee
    $("#createUserButton").click((event) => {
        event.preventDefault();
        const first = $("#firstName").val();
        const capFirst = first.toUpperCase();
        const last = $("#lastName").val();
        const capLast = last.toUpperCase();
        const number = $("#phoneNumber").val();
        const info = {
            firstName: capFirst,
            lastName: capLast,
            phoneNumber: number,
            attendanceCount: count
        };
        if((capFirst === "") || (capLast === "") || (number === "")){
            alert("Please fill all fields appropriately");
        } else{
            $.post("http://localhost:3000/users", info, alert("User successfully created"));
            location.reload(true);
        }
    });
// end of create new employee

// get request: to list all employees
    $("#list-employees-button").click((event) => {
        event.preventDefault(); 
        $(".all-employee").remove();
        $.get("http://localhost:3000/users", (data) => {
            for (let index = 0; index < data.length; index++) {
                $("#list-all-employees").append(`
                <li class="all-employee list-group-item d-flex justify-content-between align-items-center">
                    ${data[index].firstName} ${data[index].lastName} 
                <span class="badge badge-secondary badge-pill"> ${data[index].phoneNumber}</span>
                <span class="badge badge-primary 07060858400"> ${data[index].attendanceCount}</span>
                </li>`);
            }
        });
        $("#close-employees-list").show().click(()=>{
            $(".all-employee").remove();
            location.reload(true);
        });
    });
// end of list all employees

// get request: to list an employee
    $("#list-one-employee").click((event)=> {
        event.preventDefault();
        const userNumber = $("#employee-ID").val(); 
        $.get(`http://localhost:3000/users/?phoneNumber=${userNumber}`, (user) => {
            if(user.length === 0){
                $(".one-employee").remove();
                $("#list-an-employee").append(`<li class="one-employee">User doesn't exists in db</li>`);
            } else{
                $(".one-employee").remove();
                $("#list-an-employee").append(`<li class="one-employee list-group-item d-flex justify-content-between align-items-center">
                    ${user[0].firstName} ${user[0].lastName} <span class="badge badge-success badge-pill"> ${user[0].phoneNumber}</span>
                </li>`);
            }
        });
    });
// end of list an employee

// get request: to delete an employee
    $("#delete-employee-button").click((event)=> {
        const userNumber = $("#employee-ID").val();
        $.get(`http://localhost:3000/users/?phoneNumber=${userNumber}`, (user) =>{
            const userID = user[0].id;
            if(user.length === 0){
                $(".one-employee").remove();
                $("#list-an-employee").append(`<li class="one-employee">User doesn't exists in db</li>`);
            } else{
                $(".one-employee").remove();
                $.ajax({
                    url: `http://localhost:3000/users/${userID}`,
                    type: 'DELETE',
                    dataType: 'json',
                    success: function(){
                        $("#list-an-employee").append(`<li class="one-employee">User successfully DELETED</li>`);
                    }
                });
            }
        });
    });
// end of request to delete employee

// update employee attendance status
    $("#markSubmitButton").click((event) => {
        event.preventDefault();
        $("#markSuccess").remove();
        const getNumber = $("#userPhoneNumber").val();
        $.get(`http://localhost:3000/users/?phoneNumber=${getNumber}`, (user) =>{
            if (user.length === 0) {
                alert("User doesn't exist ..! See ADMIN for more details");
                location.reload(true);
            } else {
                const getID = user[0].id;
                const fName = user[0].firstName;
                const lName = user[0].lastName;
                const pNumber = user[0].phoneNumber; 
                let meetCount = parseInt(user[0].attendanceCount);
                meetCount++;
                $.ajax({
                    url: `http://localhost:3000/users/${getID}`,
                    type: "PUT",
                    dataType: "json",
                    data: {
                        firstName: fName,
                        lastName: lName,
                        phoneNumber: pNumber,
                        attendanceCount: meetCount 
                    },
                    success: function(){
                        alert(`Attendance Successfully Marked for Meeting day: ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`);
                        location.reload(true);
                    },
                });
            }
        });
    });
// end of update employee attendance status 
});