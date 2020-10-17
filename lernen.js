// hooks: {
//   beforeCreate: (user) => {
//     const salt = bcrypt.genSaltSync();
//     user.password = bcrypt.hashSync(user.password, salt);
//   },
// },
// instanceMethods: {
//   validPassword: function (password) {
//     return bcrypt.compareSync(password, this.password);
//   },
// },

// User.beforeUpdate(async (user) => {
//   console.log('hello');
// });
