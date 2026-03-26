/** 로그인 에러 메시지 컴포넌트 */
export function SignInErrorMessage({ error }: { error: string | null }) {
  if (!error) return null;

  const messages: Record<string, string> = {
    callback_failed: '로그인 처리 중 문제가 발생했습니다. 다른 소셜 계정으로 시도해주세요.',
  };

  const message = messages[error] ?? '로그인에 실패했습니다. 다른 소셜 계정으로 시도해주세요.';

  return (
    <div role="alert" className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}
