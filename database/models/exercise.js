'use strict';
module.exports = (sequelize, DataTypes) => {
  const exercise = sequelize.define('exercise', {
    name: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    type: DataTypes.STRING,
    video_id: DataTypes.INTEGER,
    calorie: DataTypes.FLOAT,
    playtime: DataTypes.FLOAT,
    effect: DataTypes.TEXT
  }, {});
  exercise.associate = function(models){

	exercise.belongsTo(models.video, {
	  foreignKey: 'video_id',
	  targetKey: 'id'
	});
  };
  return exercise;
};
