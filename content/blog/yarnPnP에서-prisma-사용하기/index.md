---
title: yarnPnP 환경에서 prisma-client 사용하기
date: "2023-04-16T12:32:19.896Z"
description: "PnP환경으로 생기는 문제와 해결방법"
category: "database"
---

## PnP에서 문제가 생기는 부분
prisma-client의 경우 node_module안에 생성을 해주는데, PnP환경에서는 없기 때문에 문제가 된다.

## 해결 방법
PnP를 지원하지 않는 패키지에 대한 호환성 문제를 해결 하기위해 yarn엔 pnpify라는 도구가 존재한다. 이를 통해 해결한다.
1. yarn add @yarnpkg/pnpify
2. schema.prisma의 generator client 안에 다음과 같이 client를 출력할 경로를 추가한다.(아래의 예시처럼 한다면 /prisma에 추가됨)
```
generator client {
  provider = "prisma-client-js"
  output   = "./"
}
```
3. prisma-client import 편의성을 위해 package.json에 위에서 추가한 경로를 link로 추가해 준다.
```js
{
...
	"dependencies": {
		...
		"prisma-client": "link:./prisma",
		...
	}
...
}
```
4. yarn pnpify prisma db push, yarn pnpify prisma generate와 같이 pnpify를 붙여 명령어를 실행한다. studio 실행 시는 따로 안해도 괜찮다.
5. https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo를 참고해서 next.config.js에 webpack관련 설정을 추가한다. monorepo가 아니라도 yarn PnP를 쓸 때 next에서 해당 플러그인을 사용하지 않으면 에러가 발생한다(현재 13.2.4 기준)

## 결론
PnP가 no install에 디스크 공간도 적게 차지하는 등의 매력적인 환경임에는 틀림 없지만, 이런 문제들로 인해 아직은 실무에서 적용하기에는 적지 않은 비용이 들 것임을 또 한번 느꼈다.