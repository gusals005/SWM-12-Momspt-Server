'use strict';
module.exports = (sequelize, DataTypes) => {
	const body_type = sequelize.define('body_type',{
		name: {type: DataTypes.STRING, allowNull:false},
		explanation: {type:DataTypes.TEXT},
		pt_plan_id: {type:DataTypes.INTEGER}
	}, {});
	body_type.associate = function(models){
	  /*
		body_type.belongsTo(models.pt_plan, {
		foreignKey: 'pt_plan_id',
        targetKey: 'id'
      });
	  */
	};
	return body_type;
};

