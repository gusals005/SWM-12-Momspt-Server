'use strict';
module.exports = (sequelize, DataTypes) => {
	const history_body_type = sequelize.define('history_body_type',{
		user_id : DataTypes.INTEGER,
		body_type_id : DataTypes.INTEGER
	}, {});
	history_body_type.associate = function(models){
		history_body_type.belongsTo(models.user, {
			foreignKey:'user_id',
			targetKey:'id'
		});
	};
	return history_body_type;
};

