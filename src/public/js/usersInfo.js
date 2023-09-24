
console.log("usersInfo.js");


const removeUser = async(userId)=>{
    console.log(userId);
    fetch(`https://proyecto-final-backend-carlos-falcon.onrender.com/api/users/${userId}`, {method: 'DELETE'});
};


const modifyUserRole = async(userId)=>{
    console.log(userId);
    fetch(`https://proyecto-final-backend-carlos-falcon.onrender.com/api/users/premium/${userId}`, {method: 'PUT'});
};