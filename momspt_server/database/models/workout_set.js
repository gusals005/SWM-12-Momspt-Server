'use strict';
module.exports = (sequelize, DataTypes) => {
	const workout_set = sequelize.define('workout_set',{
		set_id : { type: DataTypes.INTEGER},
		workout_id : {type:DataTypes.INTEGER}
	}, {});
	workout_set.associate = function(models){
		workout_set.belongsTo(models.workout, {
			foreignKey: 'workout_id',
			targetKey:'id'
				})	
	};
	return workout_set;
};
