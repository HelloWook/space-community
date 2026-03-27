import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Overlay } from '../Overlay';

describe('Overlay', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    children: <div>테스트 콘텐츠</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('open=true일 때 콘텐츠를 렌더링한다', () => {
    render(<Overlay {...defaultProps} />);
    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
  });

  it('open=false일 때 콘텐츠를 렌더링하지 않는다', () => {
    render(<Overlay {...defaultProps} open={false} />);
    expect(screen.queryByText('테스트 콘텐츠')).not.toBeInTheDocument();
  });

  it('title이 있으면 제목을 표시한다', () => {
    render(<Overlay {...defaultProps} title="테스트 제목" />);
    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
  });

  it('description이 있으면 설명을 표시한다', () => {
    render(<Overlay {...defaultProps} title="제목" description="테스트 설명" />);
    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
  });

  it('role="dialog"가 존재한다', () => {
    render(<Overlay {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    render(<Overlay {...defaultProps} />);
    // shadcn DialogContent의 X 닫기 버튼
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('className prop으로 추가 스타일을 적용할 수 있다', () => {
    render(<Overlay {...defaultProps} className="w-[500px]" />);
    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
  });

  it('size prop에 따라 다이얼로그가 렌더링된다', () => {
    const { rerender } = render(<Overlay {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Overlay {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Overlay {...defaultProps} size="xl" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // --- 접근성 테스트 (T033) ---

  it('title 없이도 sr-only DialogTitle이 렌더링된다', () => {
    render(<Overlay {...defaultProps} />);
    // role="heading" 또는 sr-only 제목이 DOM에 존재해야 함
    // Radix DialogTitle은 항상 렌더링되어 스크린리더 접근성을 보장
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // sr-only 텍스트("오버레이")가 DOM에 있는지 확인
    expect(screen.getByText('오버레이')).toBeInTheDocument();
  });

  it('description prop 전달 시 aria-describedby가 연결된 설명이 존재한다', () => {
    render(
      <Overlay {...defaultProps} title="제목" description="접근성 설명 텍스트" />,
    );
    // Radix Dialog는 DialogDescription 존재 시 aria-describedby를 자동으로 설정
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // DialogDescription 텍스트가 DOM에 렌더링되는지 확인
    expect(screen.getByText('접근성 설명 텍스트')).toBeInTheDocument();
  });

  it('title prop 전달 시 DialogTitle이 렌더링된다', () => {
    render(<Overlay {...defaultProps} title="접근성 제목" />);
    // aria-labelledby를 통해 title이 dialog에 연결됨
    const heading = screen.getByText('접근성 제목');
    expect(heading).toBeInTheDocument();
    // sr-only 폴백이 아닌 실제 title이 렌더링되어야 함
    expect(screen.queryByText('오버레이')).not.toBeInTheDocument();
  });
});
