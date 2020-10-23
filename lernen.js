// das folgende Beispiel gibt eine Instance zurück, das ist ein Objekt, indem die dataValues, die Daten
// beinhaltet. Da getters und setters intern genutzt werden, kann ich trotzdem user.firstname nutzen

// const users = await User.findAll();

// console.log(users);

// {
//   dataValues:
//    { id: 16,
//      firstName: 'John',
//      lastName: 'Hancock',
//      createdAt: 2018-01-22T19:18:39.875Z,
//      updatedAt: 2018-01-22T19:18:39.879Z,
//      authorId: 6 },
//      ...
//    }

// hooks greifen in den lifecycle ein. hooks beziehen sich auf das model.
// hooks speichern die Daten im Backend
// das ist mir noch nicht klar, ich meine, dass es hooks für einzelne instancen gibt und damit
// sich nicht auf das model beziehen, wie beispielsweise beforeupdate????

// instance methods, beziehen sich auf eine instance und werden auf den prototype gesetzt
// ergebnisse einer instance method werden nicht im backend gespeichert
// werden Ergebnisse der instance methods wirklich nicht gespeichert???

// When deciding between the two approaches, consider the need for persistence
// in the database; hooks allow for back-end capture of calculated information,
// whereas instance methods do not.

// getter und setter
// wenn am getter und setter virtual dran ist, dann werde sie nicht in der datenbank gespeichert
// wenn setter und getter nicht extra definiert werden, kann man auch validate im model nutzen, dann müssen
// setter und getter teil des feldes sein

// Normally, we expect that 'getting' a property will simply return the value at that key in the object, and 'setting' a property will set that property in the object.
// 'Getters' and 'setters' allow us to override that expected behavior.
// hier sind get und set im feld definiert, d.h. man kann validate nutzen, wenn man ein VIRTUAL macht, dann wird es nicht gespeichert
// const Pug = db.define('pugs', {
//   name: {
//     type: Sequelize.STRING,
//     get () { // this defines the 'getter'

//       return this.getDataValue('name') + ' the pug'
//       // this getter will automatically append ' the pug' to any name
//     },
//     set (valueToBeSet) {
//       this.setDataValue('name', valueToBeSet.toUpperCase())
//       // this setter will automatically set the 'name' property to be uppercased
//     }
//   }
// })

// virtuals
//Virtual columns are similar to instance methods. The difference is you access
//virtual columns the same way you access a regular property
//(via the 'get' and 'set' meta-operation), whereas instance methods are functions
//that you must invoke.
// fullName: {
//   type: Sequelize.VIRTUAL,
//   get () {
//     return this.getDataValue('firstName') + ' ' + this.getDataValue('lastName')
//   }
// }
// const pug = await Pug.create({firstName: 'Cody', lastName: 'McPug'})
// console.log(pug.fullName) // "Cody McPug"

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

// AND logic
// const sevenYearOldBlackPugs = await Pug.findAll({
//   where: { // like saying: SELECT * from pugs WHERE age = 7 AND color = 'black';
//     age: 7,
//     color: 'black'
//   }
// })

// console.log(sevenYearOldBlackPugs)

// Search Operators
// Sequelize stores these operators on the `Sequelize.Op` module:
// const Op = Sequelize.Op

// Pug.findAll({
//   where: {
//     age: {
//       [Op.lte]: 7 // square brackets are needed for property names that aren't plain strings
//     }
//   }
// })
//https://sequelizedocs.fullstackacademy.com/search-operators/

// query Abfrage aus zwei Modellen
//https://gist.github.com/zcaceres/83b554ee08726a734088d90d455bc566
// Albums.findAll({
//   include: [{
//     model: Artists,
//     as: 'Singer',
//     where: { name: 'Al Green' } //
//   }]
// })
// .then(albums => console.log(albums))
// .catch(console.error)
