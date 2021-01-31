const faker = require('faker');
const bcrypt = require('bcryptjs');

const hashedPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

function generateDataPoint({ id }) {
  faker.seed(id); // Auskommentieren für Random-Werte
  let companyId = faker.helpers.randomize([1, 2, 3]);
  let role = 'user';
  switch (id) {
    case 1: {
      companyId = 1;
      role = 'admin';
      break;
    }
    case 2: {
      companyId = 2;
      role = 'admin';
      break;
    }
    case 3: {
      companyId = 3;
      role = 'admin';
      break;
    }
    default: {
      role = 'user';
    }
  }

  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let title = faker.name.jobTitle();
  let department = faker.name.jobArea();
  let departmentShort = department.split('').slice(0, 3).join('').toUpperCase();

  let date = new Date();
  return {
    user: {
      company_id: companyId,
      name: faker.internet.userName(firstName, lastName),
      email: faker.internet.email(firstName, lastName),
      password: hashedPassword('secret'),
      role: role,
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
      department: department,
      department_short: departmentShort,
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

function generateData(amount) {
  let data = [];
  for (let i = 0; i < amount; i++) {
    let id = i + 1;
    process.stdout.write('Generating data point # ' + id + '\r');
    data.push(generateDataPoint({ id }));
  }
  return data;
}

module.exports = {
  generateData,
};
