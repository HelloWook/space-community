// 백엔드 샘플 유닛 테스트 — 테스트 환경 동작 검증용
describe('백엔드 테스트 환경', () => {
  it('기본 산술 연산이 정상 동작해야 한다', () => {
    expect(1 + 1).toBe(2);
  });

  it('객체 비교가 정상 동작해야 한다', () => {
    const health = { status: 'ok' };
    expect(health).toEqual({ status: 'ok' });
  });
});
