---
title: node환경에서 jest사용을 피하는 이유
date: "2023-04-27T21:28:19.896Z"
description: "jest의 구현 방식인 node:vm으로 인한 문제"
category: "testing"
---

## jest의 병렬처리 방식
무엇이 문제인지 알려면 jest의 병렬처리 방식에 대해 알아야 할 필요가 있다.
> isolated - Tests are parallelized by running them in their own processes to maximize performance.

위의 문구는 jest의 가이드에 있는 내용으로, 테스트들은 자체 프로세스에서 실행함으로써 병렬처리 한다고 하는 내용이다.

그렇다면 jest는 이를 어떻게 구현 하였을까? jest는 V8 가상 머신 컨텍스트 내에서 코드를 실행하게 할 수 있는 node:vm module을 이용하여 구현하였다. 

## 그래서, 그게 뭐가 문제인데?
node:vm은 각자의 컨텍스트를 가졌고, global 객체인 Array, Error와 같은 객체도 가졌다. 그리고 해당 컨텍스트 내에서 Jest는 mock등의 기능을 제공하기 위해 overwrite한다. 그런데, Node.js의 core module에서는 이 overwrite된 객체를 사용 하지않고 기본 구현을 따른다. 이로 인해 객체를 비교할 때 문제가 생긴다.

## 문제 샘플코드
```js
const { readFileSync } = require('fs');

it('error가 일치하여 테스트 통과', () => {
    try {
      throw new Error('test');
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('error instance가 일치하지 않아 테스트 실패', () => {
    try {
      readFileSync('not-exist');
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
```
위에서 설명했던 문제가 여기서 발생한다. node의 fs core module의 readFileSync를 통해 없는 파일을 읽게 하는 시도를 하게하여 Error를 던지게 하였지만 테스트에서는 두 개의 객체가 같지 않아 에러가 나버린다. 즉, `instanceof`의 정상적인 작동을 기대할 수 없다는 뜻이다. 이는 현재 2023/04/27일 기준 최신 버전인 v29.5.0에서도 발생한다.

이런 이유로 Node.js의 기술 결정 위원회(TSC, Technical Steering Committee)의 멤버인 Matteo Collina도 Node.js 앱에서 jest를 [사용하지 않는다](https://twitter.com/matteocollina/status/1600058525916360704)는 트윗을 남긴 적이 있다.

## 대체제
1. vitest 
2. nodetap
3. jest를 유지하고 싶다면 jest-environment-node-single-context, jest-light-runner등의 사용

나의 경우는 이미 vitest를 애용하고 있어 1번을 채택한 상황이며 2,3번은 사용해 보지 않았다. 하지만 vitest는 아직 정식버전이 나오지 않았고, 이로 인한 불안으로 jest를 유지하고 싶은 상황도 분명히 많을것으로 보인다. 그럴 때는 2,3번의 대체제가 나을거라고 생각한다.