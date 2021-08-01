'use strict';
module.exports = (sequelize, DataTypes) => {
  const video = sequelize.define('video',{
    name: DataTypes.STRING,
    explanation: DataTypes.TEXT,
    playtime: DataTypes.FLOAT
  }, {});
  video.associate = function(models){

  }
  return video;
};

