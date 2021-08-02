'use strict';
module.exports = (sequelize, DataTypes) => {
  const workout  = sequelize.define('workout', {
    name: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    type: DataTypes.STRING,
    video_id: DataTypes.INTEGER,
    calorie: DataTypes.FLOAT,
    playtime: DataTypes.FLOAT,
    effect: DataTypes.TEXT,
	thumbnail:DataTypes.STRING	
}, {});
  workout.associate = function(models){

	workout.belongsTo(models.video, {
	  foreignKey: 'video_id',
	  targetKey: 'id'
	});
  };
  return workout;
};
