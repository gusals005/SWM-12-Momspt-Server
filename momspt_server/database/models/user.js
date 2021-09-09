'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
	  nickname: {type: DataTypes.STRING, allowNull:false},
    babyDue: {type: DataTypes.DATE,allowNull:false},
    weightBeforePregnancy : {type: DataTypes.FLOAT, allowNull:true},
    weightNow:{type: DataTypes.FLOAT, allowNull:true},
    heightNow:{type:DataTypes.FLOAT, allowNull:true}
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
