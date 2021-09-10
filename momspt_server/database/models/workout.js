'use strict';
module.exports = (sequelize, DataTypes) => {
  const workout  = sequelize.define('workout', {
    name: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    type: DataTypes.STRING,
    calorie: DataTypes.FLOAT,
    playtime: DataTypes.FLOAT,
    effect: DataTypes.TEXT,
	  thumbnail:DataTypes.STRING,
    video: DataTypes.STRING
}, {});
  workout.associate = function(models){
  };
  return workout;
};
