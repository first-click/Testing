'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role_person extends Model {
    static associate(models) {
      Role_person.belongsTo(models.role, {
        foreignKey: 'role_id',
      });
      Role_person.belongsTo(models.person, {
        foreignKey: 'person_id',
      });
    }
  }

  Role_person.init(
    {
      role_person_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role_id: {
        // primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'role',
          key: 'role_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      person_id: {
        // primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'person',
          key: 'person_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'role_person',
      name: { singular: 'role_person', plural: 'roles_persons' },
      tableName: 'roles_persons',
    }
  );
  return Role_person;
};
