'use strict';
module.exports = (sequelize, DataTypes) => {
  const workout  = sequelize.define('workout', {
    name: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    calorie: DataTypes.FLOAT,
    playtime: DataTypes.FLOAT,
    thumbnail:DataTypes.STRING,
    videoCode: DataTypes.STRING,
    workoutCode: DataTypes.STRING,
    ai:DataTypes.BOOLEAN
}, {});
  workout.associate = function(models){
  };
  return workout;
};
