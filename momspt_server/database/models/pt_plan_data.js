'use strict';
module.exports = (sequelize, DataTypes) => {
	const pt_plan_data = sequelize.define('pt_plan_data',{
		body_type_id: {type: DataTypes.INTEGER},
		workout_set_id: {type:DataTypes.INTEGER},
		workout_date: {type:DataTypes.INTEGER},
	}, {});
	pt_plan_data.associate = function(models){
	  pt_plan_data.belongsTo(models.workout_set, {
        foreignKey: 'workout_set_id',
        targetKey: 'id'
      });	
	};
	return pt_plan_data;
};
