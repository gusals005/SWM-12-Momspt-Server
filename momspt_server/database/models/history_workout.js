'use strict';
module.exports = (sequelize, DataTypes) => {
	const history_workout = sequelize.define('history_workout',{
		id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
		user_id : DataTypes.INTEGER,
		date : DataTypes.INTEGER,
		workout_id : DataTypes.INTEGER,
		pause_time : DataTypes.INTEGER,
		score: DataTypes.STRING
	}, {});
	history_workout.associate = function(models){
		history_workout.belongsTo(models.user, {
			foreignKey:'user_id',
			targetKey:'id'
		});
		history_workout.belongsTo(models.workout, {
			foreignKey:"workout_id",
			targetKey:"id"
		})
	};
	return history_workout;
};

