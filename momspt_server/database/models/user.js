'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
	name: {type: DataTypes.STRING, allowNull:false},
    baby_birthday: {type: DataTypes.DATE,allowNull:false},
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
