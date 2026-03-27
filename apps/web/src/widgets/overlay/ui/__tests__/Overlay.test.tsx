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
});
