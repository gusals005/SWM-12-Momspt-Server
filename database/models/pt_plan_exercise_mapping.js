'use strict';
module.exports = (sequelize, DataTypes) => {
	const pt_plan_exercise_mapping = sequelize.define('pt_plan_exercise_mapping',{
		pt_plan_id: {type: DataTypes.INTEGER},
		exercise_id: {type:DataTypes.INTEGER},
		exercise_date: {type:DataTypes.DATE},
		exercise_order:{type:DataTypes.INTEGER}
	}, {});
	pt_plan_exercise_mapping.associate = function(models){
	  
	  pt_plan_exercise_mapping.belongsTo(models.pt_plan, {
        foreignKey: 'pt_plan_id',
        targetKey: 'id'
      });

	  pt_plan_exercise_mapping.belongsTo(models.exercise, {
        foreignKey: 'exercise_id',
        targetKey: 'id'
      });	
	};
	return pt_plan_exercise_mapping;
};
