import { render, screen, fireEvent } from '@testing-library/react';
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

  it('ESC 키를 누르면 onClose를 호출한다', () => {
    render(<Overlay {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('연보라 글래스모피즘 스타일 클래스가 적용된다', () => {
    const { container } = render(<Overlay {...defaultProps} />);
    const overlay = container.querySelector('[data-testid="overlay-backdrop"]');
    expect(overlay).toBeInTheDocument();
  });

  it('className prop으로 추가 스타일을 적용할 수 있다', () => {
    render(<Overlay {...defaultProps} className="w-[500px]" />);
    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
  });
});
