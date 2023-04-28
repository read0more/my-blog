---
title: prisma를 mocking해보자
date: "2023-04-28T12:30:19.896Z"
description: "vitest환경에서 prisma를 mocking하여 테스트 하는 방법"
category: "testing"
---

## 들어가기 전에
이 글은 prisma blog의 [The Ultimate Guide to Testing with Prisma part1](https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o)에서 prisma를 mocking 하는 방법에 대해서만 정리한 글이다. 링크의 글은 mock이 무엇인지, 왜 vitest를 선택했는지 등의 내용들이 있으니 한 번쯤 읽어보는 것을 추천한다.

## prisma를 mocking해야 하는 이유
먼저 언급해두자면, mocking하지 않아도 테스트 자체는 돌아가기는 한다. 하지만 다음과 같은 문제점이 있다.
1. 실제로 DB에 쌓는 작업이 들어가게 되어 테스트 속도가 현저하게 느려진다.
2. 테스트로 인해 불필요하게 쌓인 row를 제거하는 작업이 필요하다.
3. 이전 테스트들에서 쌓인 데이터가 이후의 테스트에 영향을 미칠 수 있어 테스트의 독립성이 깨진다.

셋 다 치명적인 문제점으로 이를 해결하기 위해 prisma의 mocking이 필요하다

## 필요한 package 설치
먼저 `npm i -D vitest-mock-extended`로 vitest-mock-extended를 설치한다. jest환경에서는 `jest-mock-extended`를 설치하면 되지만 [이전 글](/%08node환경에서-jest사용을-피하는-이유/)에서 설명한 이유로 jest환경에서 prisma를 테스트 하는 것은 추천하지 않는다.

## mocking 방법
먼저, prisma-client의 객체를 export하는 모듈을 작성한다.
```js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

해당 모듈에 __mocks__ 디렉토리를 생성하고, 위에서 생성한 모듈과 같은 이름을 가진 파일을 생성하여 다음 예시와 같은 prisma client에 대한 mock을 작성한다. 이 글은 prisma mocking에 대한 내용이므로 자세한 내용은 생략하겠으나, 왜 이렇게 작성하는지에 알고 싶다면 vitest의 [Automocking algorithm](https://vitest.dev/guide/mocking.html#automocking-algorithm)을 참고하길 바란다.
```js
import { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
  mockReset(prisma);
});

const prisma = mockDeep<PrismaClient>();
export default prisma;
```

## 테스트
User라는 모델이 있고, User의 create에 대해 mocking한다고 가정하면 다음과 같이 mocking할 수 있다.
```js
import prisma from '../__mocks__/prismaClient'; // 위에서 작성한 mock
vi.mock('../prismaClient'); // 위에서 작성한 prisma client 객체를 export하는 모듈

test('registration should return the generated user without password', async () => {
  prisma.user.create.mockResolvedValue(dummyNewUser); // user create시에 dummyNewUser를 return하게 변경
});
```
이로 인해 해당 테스트 내에서 prisma에서 user를 create 할 때는 무조건 dummyNewUser를 결과로 주게 된다. 또한, mock module에서 
```js
beforeEach(() => {
  mockReset(prisma);
});
```
다음 코드로 각 테스트마다 reset하기 때문에 mock이 리턴하는 값은 각 테스트 별로 독립적임을 보장한다.