'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
	name: {type: DataTypes.STRING, allowNull:false},
    baby_birthday: {type: DataTypes.DATE,allowNull:false},
	pt_plan_id:{type:DataTypes.INTEGER},
	body_type_id:{type:DataTypes.INTEGER},
  }, {});
  user.associate = function(models) {
    // associations can be defined here
	user.belongsTo(models.pt_plan, {
      foreignKey: 'pt_plan_id',
      targetKey: 'id'
    });	
	user.belongsTo(models.body_type, {
	  foreignKey: 'body_type_id',
	  targetKey: 'id'
	});
  };
  return user;
};
