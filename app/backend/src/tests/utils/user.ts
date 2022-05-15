const user = {
  admin: {
    adminValido: {
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@admin.com',
      password: 'secret_admin',
    },
    adminInvalido: {
      id: 1,
      username: 'Admin',
      role: 'roleInvalido',
      email: 'admincom',
      password: 'senha_invalida',
    },
  },
}

export default user;