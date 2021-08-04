'use strict';
module.exports = (sequelize, DataTypes) => {
	const history_pt_plan = sequelize.define('history_pt_plan',{
		user_id:DataTypes.INTEGER,
		past_workout_set_id:DataTypes.INTEGER,
		new_workout_set_id:DataTypes.INTEGER,
		date:DataTypes.INTEGER

	}, {});
	history_pt_plan.associate = function(models){	
		history_pt_plan.belongsTo(models.user, {
			foreignKey: 'user_id',
			targetKey: 'id'
			});
	};
	return history_pt_plan;
};
