
console.log("usersInfo.js");


const removeUser = async(userId)=>{
    console.log(userId);
    fetch(`/api/users/${userId}`, {method: 'DELETE'});
};


const modifyUserRole = async(userId)=>{
    console.log(userId);
    fetch(`/api/users/premium/${userId}`, {method: 'PUT'});
};