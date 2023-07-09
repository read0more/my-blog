---
title: i18n-자동화
date: "2023-07-09T21:32:19.896Z"
description: "Google Sheet API와의 연동을 통한 협업 및 자동화"
category: "JS"
---

사내 서비스가 해외 진출을 목표를 하고 있고, 이를 미리 준비하기 위해 작업했던 일이다.

## 공유 시트를 보고 직접 입력하는 것은 엄청나게 지루하고, 생각보다 오래걸린다.
해외 진출을 한다고 하니 예전에 다녔던 회사에서 i18n 작업을 했던 기억이 났다. 공유시트에서 번역된 문장을 보고 일일이 i18n관련 json에 옮겼던 기억이.
이건 정말이지 엄청나게 지루하고 시간도 잡아먹는 시간낭비의 결정체 같은 작업이었기에, 이번에는 이렇게 되지 않도록 미리 자동화에 대한 준비를 생각하였다.

## 제일 먼저 알아봐야 할당량은?
자세한 내용은 [여기](https://developers.google.com/sheets/api/limits?hl=ko)에 있는데, 무료이고 분당 최대 요청은 300건이다. 목표로 하는 자동화는 다음 2가지였다.

고객이 사용할 부분이 아니고 내부에서만 사용할 것이고, 분당 300번이나 쓸 경우는 사실 없다고 봐도 좋을것이다.

## 작업할 내역
1. CI/CD과정 또는 개발중 확인을 위해 공유 시트에 올라온 번역을 json으로 내려받는다.
- 사이트의 문장들은 이 json을 읽어 번역한다.
2. 개발자가 발견한 추가로 번역이 필요한 부분에 대해 정리한 json을 Google Sheet에 올린다.

## Google Sheet와의 연동 준비
나같은 경우는 Google Cloud의 APIs and services에서 Google Sheet API를 활성화하고, Service Account를 생성하여 생성한 Service Account의 keys에서 계정에 대한 json을 받았다. 이를 이용해 Google Sheet API를 사용하였다.

그리고 추가로 api 사용을 위해 `googleapis` 패키지를 추가하였다.


## Google Sheet와의 연동
먼저 시트의 컬럼명은 우선 **페이지명, id, ko, en, jp**로 하였다.

인증관련된 코드는 다음과 같다. 읽기, 쓰기에서 동일하게 필요하기 때문에 따로 분리하였다. client_secret.json은 Service Account의 keys에서 받은 json이다. 
```js
const path = require("path");
const process = require("process");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const KEY_FILE = path.join(process.cwd(), "client_secret.json");

/**
 *
 * @returns {Promise<google.auth.GoogleAuth>}
 * @throws {Error}
 */
async function authorize() {
  try {
    return new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: SCOPES,
      // client_secret.json대신 .env 사용 하고 싶다면 아래 주석 해제
      // credentials: {
      //   type: process.env["TYPE"],
      //   project_id: process.env["PROJECT_ID"],
      //   private_key_id: process.env["PRIVATE_KEY_ID"],
      //   private_key: process.env["PRIVATE_KEY"],
      //   client_email: process.env["CLIENT_EMAIL"],
      //   client_id: process.env["CLIENT_ID"],
      //   auth_uri: process.env["AUTH_URI"],
      //   token_uri: process.env["TOKEN_URI"],
      //   auth_provider_x_509_cert_url:
      //     process.env["AUTH-PROVIDER-X-509-CERT-URL"],
      //   client_x_509_cert_url: process.env["CLIENT-X-509-CERT-URL"],
      //   universe_domain: process.env["UNIVERSE_DOMAIN"],
      // },
    });
  } catch (err) {
    return null;
  }
}

module.exports = {
  authorize,
};
```

다음은 업로드에 대한 코드다. 올릴 때 번역 시트에 이미 있는 문장은 올라가지 않게 하였다.

newKeys는 개발자가 요청할 문장 또는 단어다.
```js
const { google } = require("googleapis");
const { authorize } = require("./authorize");
const newKeys = require("./newKeys");

/**
 * @param {google.auth.GoogleAuth} auth The authenticated Google OAuth client.
 */
async function uploadTranslate(auth) {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "구글시트id",
    range: "시트명!시트범위",
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  function flattenMessages(nestedMessages, prefix = "") {
    return Object.keys(nestedMessages).reduce((messages, key) => {
      let value = nestedMessages[key];
      let prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    }, {});
  }

  const koJson = flattenMessages(newKeys);
  const koKeys = Object.keys(koJson);

  const koKeysNotInRes = koKeys.filter((key) => {
    return !rows.some((row) => {
      return `${row[0]}.${row[1]}` === key;
    });
  });

  const newRows = [];
  koKeysNotInRes.forEach((key) => {
    const [pageName, translateId] = key.split(".");
    const row = [pageName, translateId, koJson[key], "", ""];
    console.log("newKeys.js에 있어 sheet에 추가 될 키: ", key);
    newRows.push(row);
  });

  if (newRows.length === 0) {
    console.log("No new keys found.");
    return;
  }

  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "구글시트id",
    range: "업로드할시트명!업로드할시트범위",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: newRows,
    },
  });

  console.log(`${result.data.updatedCells} cells updated.`);
}

authorize().then(uploadTranslate).catch(console.error);
```

마지막으로 다운로드에 대한 코드다. 생성되는 json은 한글, 영어, 일본어이며 다음과 같은 구조로 생성되게 하였다.
```js
// ko.json
{
  "페이지명": { "번역Id": "한글번역내용" },
}
```
```js
const fs = require("fs/promises");
const path = require("path");
const process = require("process");
const { google } = require("googleapis");
const { authorize } = require("./authorize");

/**
 * @param {google.auth.GoogleAuth} auth The authenticated Google OAuth client.
 */
async function listTranslate(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "구글시트id",
    range: "시트명!시트범위",
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  const json = parseRowsToObject(rows);    
  await fs.mkdir(path.join(process.cwd(), "src/i18n"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "src/i18n/ko.json"), JSON.stringify(json.ko));  
  console.log("Successfully created translate_ko.json");
  await fs.writeFile(path.join(process.cwd(), "src/i18n/en.json"), JSON.stringify(json.en));
  console.log("Successfully created translate_en.json");
  await fs.writeFile(path.join(process.cwd(), "src/i18n/jp.json"), JSON.stringify(json.jp));
  console.log("Successfully created translate_jp.json");
}

/**
 * @param {string[][]} rows
 * @returns {object}
 */
function parseRowsToObject(rows) {
  const translate = {};
  rows.forEach((row) => {
    const [page, id, ko, en, jp] = row;
    if (!translate.ko) translate.ko = {};
    if (!translate.en) translate.en = {};
    if (!translate.jp) translate.jp = {};
    if (!translate.ko[page]) translate.ko[page] = {};
    if (!translate.en[page]) translate.en[page] = {};
    if (!translate.jp[page]) translate.jp[page] = {};
    translate.ko[page][id] = ko;
    translate.en[page][id] = en;
    translate.jp[page][id] = jp;
  });

  return translate;
}


authorize().then(listTranslate).catch(console.error);

```

페이지명을 굳이 썼던 이유는 번역자가 어느 페이지에 있는지 직접 확인하여 문맥의 상황을 알게 하고 싶어서 추가 하였는데, 이는 번역 해주는 분이 오면 피드백을 받아가며 구조를 좀 더 정립해나갈 생각이다.