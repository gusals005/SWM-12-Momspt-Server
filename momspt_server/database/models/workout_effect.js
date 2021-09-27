'use strict';
module.exports = (sequelize, DataTypes) => {
  const workout_effect = sequelize.define('workout_effect', {
    workout_id: DataTypes.INTEGER,
    effect: DataTypes.STRING,
}, {});
  workout_effect.associate = function(models){
    workout_effect.belongsTo(models.workout, {
        foreignKey: 'workout_id',
        targetKey: 'id'
      });	
  };
  return workout_effect;
};
