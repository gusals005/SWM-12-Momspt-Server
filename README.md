# MomsPT Server

임산부를 위한 AI 기반 산후 재활운동 플랫폼, 맘스피티입니다.

서버에서는 사용자가 어플을 이용하는 데 있어 필요한 모든 정보와 작업들을 지원합니다.

## 시스템 아키텍쳐


![시스템아키텍쳐](/uploads/ab54facff97d76ad09494dbf04b2f335/시스템아키텍쳐.PNG)

### Service server 기술 스택

`AWS-EC2` `AWS-RDS-Postgresql` `AWS-S3` `Node.js-express` `Nginx` `Docker` `Docker-compose`

### 설명

시스템 아키텍쳐는 다음과 같습니다!

Android 어플에서 서비스를 이용하기 위해 서비스 서버와 API 통신을 하면서 데이터를 주고 받습니다.

서비스 서버에서는 유저의 요청을 처리하기 위해서 RDS-Posgresql에서 데이터를 가공해서 제공을 하거나 머신러닝 서버로 데이터를 보낸 뒤 결과값을 전달해주기도 합니다. 일반적인 텍스트들은 데이터베이스에서 전달해주고, 체형 분석과 같은 영상을 분석하는 작업에 대해서는 머신러닝을 통해서 결과를 제공합니다.

아마존 S3에서는 유저에게 운동 영상을 스트리밍형식으로 제공하기 위해서 운동 영상을 저장하고 있고, 유저가 운동을 요청할 때마다 영상을 제공해줍니다.

서버에서 Nginx 및 Node.js 서버에 대해서는 Docker를 활용하여 모두 이미지로 생성하고 컨테이너화 하고 있습니다. 추후에 사용자가 많아짐에 따라 유연하게 확장을 할 수 있는 아키텍쳐를 그리기 위해서 Docker를 사용하였고, 현재 컨테이너들끼리의 내부 통신을 위하여 Docker-compose를 통하여 컨테이너를 띄우고 있습니다. 추후에는 컨테이너들을 더 효율적으로 관리하기 위해 kubernetes를 활용할 계획입니다.


## APIs


제공하고 있는 API에 대한 정리입니다.

### 1. 오늘의 운동 리스트 정보 받기

```
사용자의 운동 리스트에 대해 정보를 제공받는 API입니다.
운동 리스트 내 운동들을 하나씩 진행하면서 산후 운동을 진행할 수 있습니다.
```

- Url

    `/workout/todayworkoutlist`

- Method

    `POST`

- Request

```json
{
    "name":"fit",
    "date": "2021-07-30"
}
```

### 2. **운동 상세정보 받기 API**

```
썸네일, 운동 이름, 운동 타입, 기대효과, 소요시간, 칼로리와 같은 운동마다 자세한 정보를
얻을 수 있는 API 입니다.
```

- Url

    `/workout/getinfo?name={name}`

- Method

    `GET`


### 3. **현재 운동의 좌표(키포인트) api**

```
운동 동작을 분석해서 점수화를 하기 위해서 운동 영상의 키포인트들을 제공하는 API입니다.
운동 영상마다 메타 데이터화 해서 제공을 하고 있고, 안드로이드에서는 실제 운동자의
키포인트와 비교하여 운동 분석 및 점수화를 진행합니다.
```

- Url

    `/getjson?name={name}`

- Method

    `GET`


### 4. 출산 후 날짜 및 문구 제공 API

```
홈 화면에서 처음에 보이는 출산 후 날짜와 문구를 제공하는 API입니다.
```

- Url

    /users/getdaycomment?name={name}

- Method

    GET


### 5. 운동 동영상 받기 API

```
운동 동영상을 스트리밍 받을 수 있는 API입니디.
```

- BaseURL : http://[d29r6pfiojlanv.cloudfront.net](http://d29r6pfiojlanv.cloudfront.net/)
- ex)힙브릿지영상 → http://[d29r6pfiojlanv.cloudfront.net](http://d29r6pfiojlanv.cloudfront.net/)/hipbridge.mp4


### 운동 썸네일 받기 API

```
운동 영상의 썸네일을 스트리밍 받을 수 있는 API입니디.
```

- BaseURL : http://[d29r6pfiojlanv.cloudfront.net](http://d29r6pfiojlanv.cloudfront.net/)


### 운동 후 결과 보내기 API

```
운동이 끝난 후 결과를 서버에 보낼 때 사용하는 API입니다.
```

- Url

    `/workout/sendresult`

- Method

    `POST`

