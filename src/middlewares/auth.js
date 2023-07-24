const checkUserAuthenticated = (req, res, next)=>{
    if (req.user) {
        next();
    }else{
        res.send(`<div> Debes autenticarte, <a href= "/login">Iniciar sesión</a></div>`);
    }
};

const checkRoles = (urlRoles)=>{
    return (req, res, next)=>{
        if(!urlRoles.includes(req.user.role)){
            return res.send(`<div> No tienes acceso, <a href= "/">Ir al home</a></div>`);
        }else{
            next();
        }
    }
};

export {checkUserAuthenticated, checkRoles}