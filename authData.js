const ROLE = {
    ADMIN: "admin",
    BASIC: "basic"
}

module.exports = {
    ROLE: ROLE,
    users: [
      { id: 1, name: 'Ryan', role: ROLE.ADMIN },
      { id: 2, name: 'Sally', role: ROLE.BASIC },
      { id: 3, name: 'Joe', role: ROLE.BASIC }
    ],
    carts: [
      { id: 1, name: "Ryan's cart", userId: 1 },
      { id: 2, name: "Sally's cart", userId: 2 },
      { id: 3, name: "Joe's cart", userId: 3 }
    ]
  }
