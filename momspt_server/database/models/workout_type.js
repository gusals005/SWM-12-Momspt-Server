'use strict';
module.exports = (sequelize, DataTypes) => {
  const workout_type = sequelize.define('workout_type', {
    workout_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
}, {});
  workout_type.associate = function(models){
    workout_type.belongsTo(models.workout, {
        foreignKey: 'workout_id',
        targetKey: 'id'
      });	
  };
  return workout_type;
};
