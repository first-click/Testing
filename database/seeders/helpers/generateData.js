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
  let postingDescription = faker.lorem.sentence();
  let postingBenefits = faker.lorem.sentence();
  let postingQualifications = faker.lorem.sentence();
  let postingWorkingHours = 10;
  let postingContactPerson = faker.name.firstName() + faker.name.lastName();
  let postingContactPhonenumber = faker.phone.phoneNumber();
  let postingSalary = 1000;

  let date = new Date();
  return {
    user: {
      username: faker.internet.userName(firstName, lastName),
      email: faker.internet.email(firstName, lastName),
      password: hashedPassword('secret'),
      company_id: companyId,
      created_at: date,
      updated_at: date,
      // junk: 'junk',
    },
    person: {
      company_id: companyId,
      user_id: id,
      person_first_name: firstName,
      person_last_name: lastName,
      created_at: date,
      updated_at: date,
      // junk: 'junk',
    },

    position: {
      company_id: companyId,
      position_title: title,
      position_department: department,
      position_department_short: departmentShort,
      created_at: date,
      updated_at: date,
    },
    posting: {
      company_id: companyId,
      position_id: id,
      posting_startdate: date,
      posting_enddate: date,
      posting_description: postingDescription,
      posting_benefits: postingBenefits,
      posting_qualifications: postingQualifications,
      posting_working_hours: postingWorkingHours,
      posting_contact_person: postingContactPerson,
      posting_contact_email: faker.internet.email(),
      posting_contact_phonenumber: postingContactPhonenumber,
      posting_salary: postingSalary,
      created_at: date,
      updated_at: date,
      // junk: 'junk',
    },
    person_position: {
      person_position_id: id,
      person_id: id,
      position_id: id,
      created_at: date,
      updated_at: date,
      // junk: 'junk',
    },
    posting_user: {
      posting_id: id,
      user_id: id,
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
    let newEntry = generateDataPoint({ id });
    // Edit duplicates generated from Faker.js
    if (data.some((entry) => entry.user.username === newEntry.user.username)) {
      newEntry.user.username = newEntry.user.username.concat([
        '_dup_',
        id.toString(),
      ]);
    }
    if (data.some((entry) => entry.user.email === newEntry.user.email)) {
      newEntry.user.email = ''.concat([
        'dup_',
        id.toString(),
        '_',
        newEntry.user.email,
      ]);
    }
    data.push(newEntry);
  }
  return data;
}

module.exports = {
  generateData,
};
