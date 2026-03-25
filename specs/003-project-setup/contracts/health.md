# Contract: Health Check Endpoint

## GET /health

서버 상태 확인 엔드포인트. 서버와 데이터베이스 연결 상태를 반환한다.

### Request

- Method: `GET`
- Path: `/health`
- Authentication: 불필요

### Response

**200 OK**

```json
{
  "status": "ok",
  "timestamp": "2026-03-25T12:00:00.000Z",
  "services": {
    "database": "connected"
  }
}
```

**503 Service Unavailable**

```json
{
  "status": "error",
  "timestamp": "2026-03-25T12:00:00.000Z",
  "services": {
    "database": "disconnected"
  }
}
```
