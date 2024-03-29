---
title: 모노레포에 대해
date: "2023-03-19T17:32:19.896Z"
description: "workspaces 설정을 통한 모노레포 생성"
category: "JS"
---

## 모노레포?
Monolithic Repositories. 즉 두 개 이상의 프로젝트가 동일한 repository에 구성 된 것을 말한다.

## 장점
- 귀찮게 IDE를 스위칭 해가면서 볼 필요가 없다
- 공통되는 코드 및 설정(prettier, eslint 같은)의 중복을 없앨 수 있다.
- 공통적으로 종속된 패키지도 관리가 편하다.

## 단점
- 종속성 충돌 문제. 예를 들어 어떤 패키지가 특정 버전의 패키지를 필요로 한다면 다른 버전의 패키지를 사용할 경우 일어나는 충돌을 말한다. 해당 부분에 대한 해결책은 다음 글에서 다루려한다.
- 권한적인 문제. 만약 각 패키지가 다른 팀이 담당하고 있다면 설령 다른 팀이라고 할지라도 코드를 수정하고 올릴 수 있다. 이 문제에 대한 처리를 해야 할 것이다.
- 패키지중 하나가 문제가 생긴다면 전체적으로 문제가 생긴다.
- 파일이 많아지니 속도가 느려진다. IDE, Git, 빌드 시 등...실제로 이러한 문제로 Uber의 경우는 다시 멀티레포로 돌아가기도 했다.

## 특정 패키지를 지정할 때
```
npm --w {각 패키지의 package.json의 name 값}
or
yarn workspace {각 패키지의 package.json의 name 값}
```
예를들어 server 패키지에 express를 추가하고 싶다면
```
npm i express --w server
or
yarn workspace server add express
```

## package.json 예시
```js
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"wsrun --parallel dev\""
  },
  "devDependencies": {
    "concurrently": "^7.6.0",
    "wsrun": "^5.2.4"
  }
}
```

workspaces에
concurrently는 여러 명령을 동시에 실행할 때 도움을 주는 패키지이다. monorepo에 관한 글이기 때문에 왜 사용하는지에 대해서는 [링크](https://github.com/open-cli-tools/concurrently#why)만 남기고 생략한다.

wsrun은 각 패키지에 있는 script를 한번에 실행시키려고 추가하였다. 예를 들어 package가 server, client 두 개가 있다면
```
"dev": "concurrently \"yarn workspace server dev\" \"yarn workspace client dev\""
```
이건
```
"dev": "concurrently \"wsrun --parallel dev\""
```
이거랑 똑같다.

## 결론
Cient와 Backend가 같은 언어로 동작하고, 프로젝트의 사이즈가 너무 크지 않을 때 편할 것으로 보인다. 특히 tRPC를 사용해 보면서 정말 편하다고 느꼈다.
하지만 모노레포를 사용함으로서 초기 설정도 훨씬 수고가 많이 들고 프로젝트가 커지면 커질수록 문제가 발생할 수 있다. 언제나 그렇지만 모든 문제를 한 번에 다 해결해 줄 수 있는 은탄환 따위는 없다.