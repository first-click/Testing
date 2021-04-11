const vectorName = '_search';

const searchObjects = {
  companies: ['company_name'],
  positions: ['position_title'],
};

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction((t) =>
      Promise.all(
        Object.keys(searchObjects).map((table) =>
          queryInterface.sequelize
            .query(
              `
          ALTER TABLE ${table} ADD COLUMN ${vectorName} TSVECTOR;
        `,
              { transaction: t }
            )
            .then(() =>
              queryInterface.sequelize.query(
                `
                UPDATE ${table} SET ${vectorName} = to_tsvector('german', ${searchObjects[
                  table
                ].join(" || ' ' || ")});
              `,
                { transaction: t }
              )
            )

            .then(() =>
              queryInterface.sequelize.query(
                `
                CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});
              `,
                { transaction: t }
              )
            )
            .then(() =>
              queryInterface.sequelize.query(
                `
                CREATE TRIGGER ${table}_vector_update
                BEFORE INSERT OR UPDATE ON ${table}
                FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.german', ${searchObjects[
                  table
                ].join(', ')});
              `,
                { transaction: t }
              )
            )
            .catch(console.log)
        )
      )
    ),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction((t) =>
      Promise.all(
        Object.keys(searchObjects).map((table) =>
          queryInterface.sequelize
            .query(
              `
          DROP TRIGGER ${table}_vector_update ON ${table};
        `,
              { transaction: t }
            )
            .then(() =>
              queryInterface.sequelize.query(
                `
                DROP INDEX ${table}_search;
              `,
                { transaction: t }
              )
            )
            .then(() =>
              queryInterface.sequelize.query(
                `
                ALTER TABLE ${table} DROP COLUMN ${vectorName};
              `,
                { transaction: t }
              )
            )
        )
      )
    ),
};
