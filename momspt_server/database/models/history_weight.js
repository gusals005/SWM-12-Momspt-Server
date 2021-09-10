'use strict';
module.exports = (sequelize, DataTypes) => {
	const history_weight = sequelize.define('history_weight',{
		user_id : DataTypes.INTEGER,
		date : DataTypes.INTEGER,
		weight : DataTypes.FLOAT
	}, {});
	history_weight.associate = function(models){
		history_weight.belongsTo(models.user, {
			foreignKey:'user_id',
			targetKey:'id'
		});
	};
	return history_weight;
};

