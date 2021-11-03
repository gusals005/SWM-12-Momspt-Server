const KAKAO_AUTH_FAIL = {
    success: false,
    message: "카카오 인증이 유효하지 않습니다."
};

const DATA_NOT_MATCH = {
    success: false,
    message: "해당 정보를 가진 유저가 없습니다."
}

const DATA_NOT_EXIST = {
    success: false,
    message: "해당 정보가 존재하지 않습니다."
}

const UPDATE_FAIL = {
    success: false,
    message: "요청에 대해서 실패하였습니다."
}

module.exports = {
    KAKAO_AUTH_FAIL,
    DATA_NOT_MATCH,
    DATA_NOT_EXIST,
    UPDATE_FAIL
}