'use strict';
module.exports = (sequelize, DataTypes) => {
	const body_type = sequelize.define('body_type',{
		name: {type: DataTypes.STRING, allowNull:false},
		explanation: {type:DataTypes.TEXT},
	}, {});
	body_type.associate = function(models){
	};
	return body_type;
};

