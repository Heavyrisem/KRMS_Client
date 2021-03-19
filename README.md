# KRMS_Client

모니터링 시스템의 클라이언트 소스코드입니다.

Socket.io 로 서버와 통신하며 KRMS 계정이 있어야 합니다.

node.js + Typescript 로 개발했습니다.

서버도 같은 구성으로 구축하였고, mongoDB를 사용합니다.


## 사용법
http://krms.xyz로 이동하여 KRMS 계정을 생성합니다.

KRMS 클라이언트의 최신 버전을 받고 클라이언트를 실행합니다.

최초 1회는 설정 파일을 생성하고 종료합니다.

생성된 `KRMS_Setting.json` 파일을 형식에 맞춰 수정합니다.

```
    language: "KO" | "EN", // 클라이언트 언어 설정
    Server: {
        Name: string, // 서버가 표시될 이름
        KRMS_Account: { // KRMS 계정
            name: string,
            passwd: string
        }
    }
```

수정 후 클라이언트를 다시 실행하면 서버와 연결됩니다.
