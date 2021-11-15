# [서버] README.md

# 목차

1. 프로젝트 기간
2. MomsPT 설명
3. 시스템 구성도
4. 맡은 부분 및 자세한 설명
5. 구현물에 대한 스크린샷
6. 팀 소개

# 프로젝트 기간

2021.06.10 ~ 2021.11.08, 12기 소프트웨어 마에스트로 본과정

# MomsPT


임산부를 위한 AI 기반 산후 재활운동 플랫폼, 맘스피티입니다.

아기가 태어난 다는 것은 인류에 가장 고귀한 일입니다.

하지만, 그 안에는 여성이 임신과 출산을 하면서 겪는 고통과 인내가 있습니다.

특히, 체형의 변화로 겪는 문제는 임신과 출산 내내 일어나며, 체형 교정을 출산 후 6개월 이내에 하지 않는다면,

다시 정상 체형으로 돌아오기 어렵습니다. 출산 여성들을 건강하게 만드는 것이 우리의 목표입니다.

맘스피티는 다음과 같은 스텝들을 통해서 출산 후 망가진 몸을 건강하게 돌아갈 수 있도록 도와줍니다.

1. 체형 분석을 통해 **'전방 경사', '골반 불균형', 'O다리' 체형**을 확인
2. 분석된 체형에 따른 **맞춤형 운동 프로그램** 제공
3. 제공된 운동을 수행하면서 **실시간으로 운동 동작 분석** 및 피드백
4. **운동량을 차트**를 통해 확인하면서 지속적으로 운동 가능


# 시스템 구성도

<img style="max-width: 80%; height: auto;" src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/65e5899a-3a05-458c-9477-de5e54eebb1c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211115%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211115T073240Z&X-Amz-Expires=86400&X-Amz-Signature=186cc9b882d7d451cc195ec8c18db164fbe2e60b44dfc5c96b2f60ee29618f87&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22" width="70%"> 

<img style="max-width: 80%; height: auto;" src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a7fb11d9-1c7b-4f23-b333-d40e7e4605ab/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211115%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211115T073311Z&X-Amz-Expires=86400&X-Amz-Signature=84ea45e107023cc1be6bfafa017222d8fcec50901abdd4ae138aeeba664699d2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22" width="70%"> 

### Service server 기술 스택

`AWS-EC2` `AWS-RDS-Postgresql` `AWS-S3` `Node.js-express` `Nginx` `Docker` `Docker-compose`

`Sequelize`  `Swagger-ui` `HTTPS 인증` `OAuth`

## 맡은 부분

API 서비스 서버 전부 구현 + 추천 운동 수행시 분석 알고리즘 구현(Kotlin)

## 서버 구현 설명  


### [API 통신 과정]

Android 어플에서 서비스 서버와 API 통신을 하면서 데이터를 주고 받습니다.

서비스 서버에서는 일반적인 요청에 대해 Posgresql에서 데이터를 가공해서 제공을 하고,

체형 분석 요청에 대해서는 머신러닝 서버로 요청을 보내어 체형 분석 결과를 전달해줍니다.

Android 개발자가 쉽게 API를 확인할 수 있도록 Swagger-ui로 API docs를 지원했습니다.

https://app.fitsionary.com/api-docs        
        
        

### [데이터 베이스 이용]

데이터베이스에서 데이터를 가져오거나 저장할 때에는 효과적으로 데이터 처리가 가능한

ORM 기술인 Sequlize를 활용하고 있습니다.


### [스토리지와 스트리밍]

아마존 S3에서는 사진이나 운동 컨텐츠의 메타데이터들을 가지고 있고, 

스트리밍을 위해 운동 영상을 저장하고 있습니다.

유저가 운동을 요청할 때마다 영상을 스트리밍 형식으로 제공해줍니다.

### [Docker의 활용]

Nginx 및 Node.js 웹 서버에 대해서는 Docker를 활용하여 모두 이미지로 생성하고 컨테이너화 하고 있습니다.     
사용자가 많아짐에 따라 유연하게 확장을 할 수 있는 아키텍쳐를 그리기 위해서 Docker를 사용하였고,

현재 컨테이너들끼리의 내부 통신을 위하여 Docker-compose를 통하여 컨테이너를 띄우고 있습니다.

추후에는 컨테이너들을 더 효율적으로 관리하기 위해 kubernetes를 활용할 계획입니다.

### [데이터 인증과 보안]

애플리케이션에서 사용하는 데이터는 개인정보이기 때문에 정보 유출이 되면 안됩니다.

그래서 데이터를 보호하기 위해 HTTP를 통해서 통신하지 않고, SSL 인증서를 통한 HTTPS를 활용합니다.

또한, 보안상 취약한 자체적인 로그인을 사용하지 않고, OAUTH를 활용하여 로그인을 구현하였습니다.


## 운동 수행시 분석 알고리즘 설명

![Untitled_2](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/357ae350-7e91-4dd0-b8fa-b1ab1b5dd03c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211115%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211115T073346Z&X-Amz-Expires=86400&X-Amz-Signature=64d2a280cef588bc0e12c040ebdc70d3242d723149bf3ffb81440ef1c78cd605&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

운동 동작 분석은 제공 영상과의 **유사도 분석**과 운동 횟수를 세는 **횟수 측정**이 있습니다.

### [기본 원리]

운동 동작 분석의 기본 원리는 Googl-MediaPipe의  Blazepose로 부터 추출된 33개의 키포인트를 활용합니다. (자세한 내용 ⇒ [https://google.github.io/mediapipe/solutions/pose](https://google.github.io/mediapipe/solutions/pose))

한 프레임마다 키포인트를 추출해낼 수 있고, 해당 키포인트들을 가지고 각도 계산이나 벡터화 같은 작업으로

수학적인 연산을 하는 것이 원리입니다.

### [유사도 분석]

Blazepose에서 제공 영상에서의 사람과 운동을 수행하는 사람의 키포인트는 각각 33개로 추출됩니다.

그리고, 해당 키포인트를 벡터화하여 데이터를 비교합니다.

한 프레임에 대해서 두 키포인트를 비교할 때에는 코사인 유사도를 사용하면 유사도 분석이 가능합니다.

하지만, 운동 영상을 보고 따라하는 수행자는 딜레이가 있기에 정확하게 제공되는 영상과 동작을 일치시킬 수 없습니다.

이를 해결하기 위해, DTW(dynamic time warping)이라는 알고리즘을 활용했습니다.

10프레임를 한 구간으로 해서, 구간에서의 유사도를 비교했고, 10프레임마다 점수가 표시되도록 하였습니다.

정리하면, 코사인 유사도와 DTW알고리즘을 통해서 유사도 분석을 점수로 나타낸 것입니다.

### [횟수 측정]

2차원 상에 겹치지 않는 3점이 있으면, 삼각형을 그릴 수 있고, 각도를 계산할 수 있습니다.

횟수 측정은 키포인트들 사이의 각도를 계산하고, 각도의 변화를 분석해서 측정하였습니다.

운동을 하게 되면, 키포인트 사이 각도 변화는 구간을 가지고 움직이게 됩니다.

예를 들어, 스쿼트는 무릎의 각도가 180 ~ 110도 정도 왔다갔다 합니다.

이를 이용해서, 해당 구간을 몇 번 왔다 갔다 하는지를 체크하여 횟수를 측정합니다.


# APIs - 서비스 전체 API

![Untitled_3](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1f67445b-59e7-4e2c-9313-6a94054e76a8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211115%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211115T073429Z&X-Amz-Expires=86400&X-Amz-Signature=f094037cf597b410090db9497c92ba840b41af379750ccd1f34482cfb6ff7628&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

![Untitled_4](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5e024dea-7583-4765-b906-dfa6bb9343a4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211115%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211115T073440Z&X-Amz-Expires=86400&X-Amz-Signature=3f25cb55cdf356707001fbfc4cc545b4343147e61362267d85463aefb2e29dec&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

![Untitled_5](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b5116316-f34e-4e46-bcbf-0ee50d5313b7/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211115%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211115T073451Z&X-Amz-Expires=86400&X-Amz-Signature=d8e14e3d697bd3c5f49c750ae50b090624a8854698c62166b65463c1a5c769a3&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)


# MomsPT 애플리케이션 화면 소개(Android)

- **Today's recommended Workout**
    - 사용자의 체형 및 출산 시기에 맞는 운동 추천
- **Workout Detail**
    - 운동에 관한 상세 정보 제공
    - 유사도 점수화 AI 코칭을 위한 운동 영상 키포인트 데이터(정면에서 촬영한 운동 영상의 키포인트)를 받아 로컬 데이터베이스에 저장
- **AI assit workout**
    - `Mediapipe Pose`를 이용해 사용자 신체의 33개 키포인트를 예측하여 화면에 표시
    - 운동 영상 스트리밍
    - `유사도 점수화 AI 코칭`은 운동 영상의 키포인트와 사용자 키포인트를 유사도 분석 후 결과로 산출된 점수 표시
    - 사용자가 획득한 점수 구간별 `BAD`, `COOL`, `GREAT`, `PERFECT` 코멘트로 즉각적인 피드백 제공
    - `횟수 측정 AI 코칭`은 사용자의 운동 반복 횟수를 표시
    - `non AI 운동`은 운동 영상만 재생
- **Daily Statistics**
    - 오늘의 운동 시간, 칼로리 정보, 주별 운동 시간 차트, 주별 체중 차트 제공
    - 달력을 통해 운동한 날을 알 수 있고, 해당일의 운동 결과 내역 제공
- **Body analysis**
    - 제자리에서 10초간 한 바퀴 도는 사용자 모습 녹화 후 머신러닝 서버로 전송
    - 머신러닝 서버로부터 사용자의 체형 분석 결과와 3D 신체 모델 `GLB` 파일을 전송 받아 다운로드
    - 다운로드한 `GLB` 파일을 3D 뷰어에 로드

# Screenshots


- **Sign in**

<img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140649658-c3f010df-0129-4161-961d-334f4971f383.gif" width="32%"> 


- **Today's recommended Workout**

<img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140651996-cb0a3c84-1771-4604-9c6a-ae507eeb7b25.png" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140651999-c5df4e50-b005-419f-b5fb-f4dca715c31c.png" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140651984-f8581177-b827-4cbe-a11f-c8418bfba8b6.png" width="32%">


- **Workout Detail**

<img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140650750-efed904b-f41d-495e-b864-736c27eb7daa.png" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140650569-e0321042-fd03-4f41-99a0-c8438fda21d4.png" width="32%">


- **AI assit workout**

<img style="max-width: 50%; height: auto;" width="100%" src="https://user-images.githubusercontent.com/54823396/140650913-590b171b-d681-4791-9c3e-35752838b425.png">


- **Daily Statistics**

<img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140649468-8e765fce-14d8-4e48-b441-50c5108c9709.png" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140649494-b4fddd69-ae93-4d0b-9a71-16051ef1f6ae.png" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140649505-3346b48e-bca9-4665-8fd4-a8ae7e472b9e.png" width="32%">

<img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140649537-c17a53b0-3aba-4f46-86fb-d3d08208c84d.png" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140649550-7d25f4c7-c64c-43d3-99c1-c48d7f7b853b.png" width="32%">


- **Body analysis**

<img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140652901-fcea138c-fc53-48b3-937d-1f78daea31c1.gif" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140652639-8d189421-7620-4ce2-a9e7-77222574606f.gif" width="32%"> <img style="max-width: 50%; height: auto;" src="https://user-images.githubusercontent.com/54823396/140652640-e927e399-f77c-4d8c-8826-3001052cbba7.gif" width="32%">


- **My Page**

<img style="height: auto;" width="64%" src="https://user-images.githubusercontent.com/54823396/140651306-8a7c3494-680f-4e97-a9b2-82b3e5157fb2.png">


## Team
|Part|Name|
|------|---|
|머신러닝|이인서|
|서버, 운동 분석 알고리즘|이현민|
|안드로이드|박해민|

