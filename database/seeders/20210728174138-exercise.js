'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('exercises',[
	{
		id: 1,
		name: 'hipbridge',
		explanation: '코어 트레이닝을 대표하는 운동 중 하나이다. 허리를 지나치게 들어올리는 동작은 부상으로 이어질 수 있습니다.',
		type:'코어 운동, 힙 운동',
		video_id:1,
		calorie:40,
		playtime:114,
		effect:'통증 완화, 골반 안정화, 코어 강화, 자세 개선, 운동 능력 향상, 힙업',
		thumbnail:'hipbridge_thumbnail',
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{
		id: 2,
		name: 'uparmleg',
		explanation:'본 운동을 통해 몸의 균형감각과 밸런스를 잡을 수 있다. 호흡에 유의해서 진행해야 한다. 허리가 과도하게 꺾이지 않게 조심해야 합니다.',
		type:'복합 운동, 팔 운동, 다리운동, 밸런스 운동',
		video_id:2,
		calorie:35,
		playtime:99,
		effect:'통증 완화, 코어 강화, 자세 개선, 힙업',
		thumbnail:'uparmleg_thumbnail',
		createdAt:new Date(),
        updatedAt:new Date()
	},
	{
		id: 3,
		name: 'tabata',
		explanation:'유산소 운동으로, 무릎 관절에 큰 무리가 가지 않으면서도 체지방 감소에 도움이 되는 운동입니다. 호흡에 집중하면서 진행하는것이 중요하며, 다리를 움직일 때 동작을 가볍게 진행하여 무릎 관절에 부하를 최소화 하며 진행하는 것이 중요합니다.',
		type:'유산소 운동',
		video_id:3,
		calorie:70,
		playtime:59,
		effect:'체지방 감소',
		thumbnail:'tabata_thumbnail',
		createdAt:new Date(),
        updatedAt:new Date()
	}
	],{});
		  /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
	await queryInterface.bulkDelete('exercises',null,{});
			/**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
