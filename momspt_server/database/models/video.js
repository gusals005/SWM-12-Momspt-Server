'use strict';
module.exports = (sequelize, DataTypes) => {
  const video = sequelize.define('video',{
    name: DataTypes.STRING,
    workoutStartTime: DataTypes.INTEGER,
    workoutFinishTime: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {});
  video.associate = function(models){
  }
  return video;
};

