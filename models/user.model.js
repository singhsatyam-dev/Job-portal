
const users = [];

export const addUser = (user)=>{
    users.push(user);
}

export const findUserByEmail = (email)=>{
    return users.find((user)=> user.email==email);
}

export const validateUser = (email,password)=>{
    return users.find(
    user => user.email === email && user.password === password
  );
}