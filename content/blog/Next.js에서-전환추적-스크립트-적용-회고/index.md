---
title: Next.js에서의 전환추적 스크립트 적용 회고
date: "2023-05-06T14:32:19.896Z"
description: "Next.js에서의 전환추적 스크립트 적용 회고"
category: "Etc"
---

## 요구사항 및 분석
이커머스 회사를 다닐 때 전환을 추적하여 분석을 하기 위해 타게팅게이츠라는 전환 추적 스크립트에 대한 요청이 왔었다.
코드를 작성하기 전에 타게팅게이츠 전환 스크립트를 어떻게 trigger 시키는 지에 대한 분석이 필요했고, 분석했던 결과는 이렇다.
1. 스크립트를 로드하면 전역 변수가 추가된다. 이 전역변수는 어떤 전환인지의 종류와 전환에 대한 디테일한 정보가 담긴다(구매전환이라면 상품에 대한 정보 등)
2. 1의 전역변수의 내용을 타게팅게이츠에 보내는 method를 가진 전역변수가 추가된다. 해당 method는 parameter가 없어 어쩔 수 없이 1에 미리 추가하고 method를 실행하는 방식으로 구현해야한다.

다음으로는 어떻게 구현하기 위한 분석이 필요했다.
1. 사용하고 있는 Next.js의 버전이 낮아(버전은 10.x.x였다) Next.js에서 제공하는 next/script모듈을 사용하지 못한다.
2. 전환 스크립트를 트리거할 페이지가 많지 않기 때문에(4~5개 정도의 페이지)_document에 추가해서 굳이 모든 페이지에서 타게팅게이츠 script를 load하게 하고 싶지 않았다.

이러한 이유로 커스텀 hooks에서 script를 load하고, load 되었는지의 여부를 return하게 하였다.

## Sample Code
### hooks 예시
```js
const id = "타게팅게이츠 script 식별할 id";

export default function useTargetingGates() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let script = document.getElementById(id) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = "스크립트 URL";
      script.async = true;
      document.body.appendChild(script);
    }

    const onLoad = () => {
      setInitialized(true);
    };

    const onError = () => {
      // script load 실패에 대한 처리...
    }

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onLoad);
    };
  }, []);

  return {
    initialized,
  };
}
```

### 구매 page 예시
```js
...
const { initialized } = useTargetingGates();

const onSubmit = () => {
 ...
 if (initialized) {
  1. 타게팅게이츠에서 요구하는 데이터 형식에 맞게 파싱하는 로직
  2. 타게팅게이츠의 script load하여 추가된 전역 변수를 통해 타게팅게이츠 측에 데이터 전송
 }
 ... 
}
...
```
