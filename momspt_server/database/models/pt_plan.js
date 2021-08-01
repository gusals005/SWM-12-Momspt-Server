'use strict';
module.exports = (sequelize, DataTypes) => {
	const pt_plan = sequelize.define('pt_plan',{
		name: {type: DataTypes.STRING, allowNull:false},
		explanation: {type:DataTypes.TEXT},
		body_type_id: {type:DataTypes.INTEGER}
	}, {});
	pt_plan.associate = function(models){
		
	  pt_plan.belongsTo(models.body_type, {
        foreignKey: 'body_type_id',
        targetKey: 'id'
      });	
	};
	return pt_plan;
};
