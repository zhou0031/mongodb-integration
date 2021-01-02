const {ROLE} = require('../authData') 

function canViewCart(user, cart){
    return(
        user.role === ROLE.ADMIN ||
        cart.userID === user.id 
    )
}

module.exports = {
    canViewCart
}