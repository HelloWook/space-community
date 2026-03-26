// 댓글 포커스 상태 Zustand 스토어 — 위성 클릭 ↔ 댓글 하이라이트 연동
import { create } from 'zustand';

interface CommentFocusState {
  focusedCommentId: string | null;
  setFocusedComment: (id: string | null) => void;
  clearFocus: () => void;
}

export const useCommentFocusStore = create<CommentFocusState>((set) => ({
  focusedCommentId: null,
  setFocusedComment: (id) => set({ focusedCommentId: id }),
  clearFocus: () => set({ focusedCommentId: null }),
}));
