const faker = require('faker');
const bcrypt = require('bcryptjs');

const hashedPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

function generateDataPoint({ id }) {
  let companyId = faker.helpers.randomize([1, 2, 3]);
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let title = faker.name.jobTitle();
  let area = faker.name.jobArea();
  let date = new Date();
  return {
    user: {
      company_id: companyId,
      name: faker.internet.userName(firstName, lastName),
      email: faker.internet.email(firstName, lastName),
      password: hashedPassword('secret'),
      role: 'admin',
      created_at: date,
      updated_at: date,
    },
    person: {
      company_id: companyId,
      user_id: id,
      person_first_name: firstName,
      person_last_name: lastName,
      created_at: date,
      updated_at: date,
    },
    position: {
      company_id: companyId,
      title: title,
      area: area,
      created_at: date,
      updated_at: date,
    },
    person_position: {
      person_id: id,
      position_id: id,
      created_at: date,
      updated_at: date,
    },
  };
}

function createUser() {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  return {
    company_id: faker.helpers.randomize([1, 2, 3]),
    name: faker.internet.userName(firstName, lastName),
    email: faker.internet.email(firstName, lastName),
    password: hashedPassword('secret'),
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  };
}

function createUsers(amount) {
  let users = [];
  for (let i = 0; i < amount; i++) {
    users.push(createUser());
  }
  return users;
}

function generateData(amount) {
  let data = [];
  for (let i = 0; i < amount; i++) {
    let id = i + 1;
    data.push(generateDataPoint({ id }));
  }
  return data;
}

// module.exports = function generateData() {};
module.exports = {
  createUsers,
  generateData,
};
