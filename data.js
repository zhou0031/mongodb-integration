const ROLE = {
    ADMIN: "admin",
    BASIC: "basic"
}

module.exports = {
    ROLE: ROLE,
    users: [
      { id: 1, name: 'Ryan', username:"z_yi23", password:'$2a$10$jcpC82Dv6CJS72I4o2Ij7uu1BUKhswBcQ5R.rLWlQZJxK96JWOWlC', role: ROLE.ADMIN },
      { id: 2, name: 'Sally', role: ROLE.BASIC },
      { id: 3, name: 'Joe', role: ROLE.BASIC }
    ],
    carts: [
      { id: 1, name: "Ryan's cart", userID: 1 },
      { id: 2, name: "Sally's cart", userID: 2 },
      { id: 3, name: "Joe's cart", userID: 3 }
    ]
  }
