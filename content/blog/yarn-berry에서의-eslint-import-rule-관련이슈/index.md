---
title: yarn PnP에서의 eslint import rule 관련이슈
date: "2023-04-23T11:10:19.896Z"
description: "module resolution으로 인한 오류와 설정 방법"
category: "JS"
---

# 발단
프로젝트 스캐폴딩용으로 github에 생성한 템플릿 repo에서 vitest관련 import에서 다음과 같은 에러가 발생했다.

1:1  error  Resolve error: synckit tried to access ", but it isn't declared in its dependencies; this makes the require call ambiguous and unsound.

Required package: " (via ""/var/folders/1s/2hvl19cn5p1bnb1x26th1m9m0000gn/T/473e5d87de9575172344d889c511233f.cjs"")
Required by: synckit@npm:0.8.5 (via /Users/yk/Documents/project/my-next-template/.yarn/cache/synckit-npm-0.8.5-40a594eb38-8a9560e5d8.zip/node_modules/synckit/lib/)


원인이 되는 부분은 해당 import ```import { defineConfig } from 'vitest/config';``` 였다.
vitest/config에서 가져오지 않고 vite에서 가져와도 별 상관은 없지만 어째서 PnP 환경에서만 발생하는지 찾아보았다.

# 원인(예상)
- 에러가 난 곳을 보니 synckit이라는 패키지에서 모듈명을 제대로 받지 못하는것으로 보인다.
- 거슬러 올라가 보니 해당 synckit은 eslint-import-resolver-typescript에서 사용한다. 여기서 제대로 된 값을 전달하지 못해 에러 문구도 와 같이 빈 문자열에 access하려다 실패한 것으로 보인다.


# 해결방법
위의 예상 원인으로 module resolution이 문제가 아닐까 했고, 해결 방법 자체는 간단하다. eslint 설정 파일에 다음 내용을 추가하면 된다.
```
settings: {
    'import/resolver': 'node',
  },
```
module resolution의 node 방식에 대한 자세한 설명은 [여기](https://www.typescriptlang.org/docs/handbook/module-resolution.html#how-nodejs-resolves-modules)에서 보는 것이 더 빠르다.

# 기타
아무래도 tsconfig의 paths를 통한 alias도 해당 설정을 해주면 eslint 에서 오류가 발생하였다. 하지만 어차피 Yarn 2+를 사용하는 이상 link 프로토콜을 쓰는게 여러모로 편하니(alias를 jest, tsconfig, storybook에 전부 따로따로 설정해야 한다던가의 이유로) ~~이 부분은 크게 신경쓰지 않아도 될 것으로 보인다~~.

vitest의 경우 link 프로토콜 사용 시 package.json을 프로젝트 루트에서 찾지 않는다.
예를들어 `"src": "link:./src"`와 같이 했다면 src에서 package.json을 찾으려 시도를 하여 에러가 발생한다. 해결을 위해서 어쩔 수 없이 vitest.config에 alias를 추가해야한다.