'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, type CreatePostFormData } from '../model/schema';
import { useCreatePlanet } from '@/entities/planet';

interface CreatePostFormProps {
  /** 게시글이 속할 은하 ID */
  galaxyId: string;
  /** 생성 성공 시 콜백 */
  onSuccess?: () => void;
}

// 게시글(행성) 작성 폼 컴포넌트
export function CreatePostForm({ galaxyId, onSuccess }: CreatePostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      authorNickname: '',
    },
  });

  const createPlanet = useCreatePlanet();

  // 폼 제출 핸들러
  const onSubmit = (data: CreatePostFormData) => {
    createPlanet.mutate(
      { galaxyId, data },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="create-post-form">
      {/* 제목 입력 필드 */}
      <div style={{ marginBottom: '12px' }}>
        <label
          htmlFor="title"
          style={{ display: 'block', color: '#ccc', marginBottom: '4px' }}
        >
          제목
        </label>
        <input
          id="title"
          type="text"
          placeholder="제목을 입력하세요"
          {...register('title')}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#1a1a2e',
            color: '#fff',
          }}
        />
        {errors.title && (
          <p role="alert" style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
            {errors.title.message}
          </p>
        )}
      </div>

      {/* 내용 입력 필드 */}
      <div style={{ marginBottom: '12px' }}>
        <label
          htmlFor="content"
          style={{ display: 'block', color: '#ccc', marginBottom: '4px' }}
        >
          내용
        </label>
        <textarea
          id="content"
          placeholder="내용을 입력하세요"
          rows={6}
          {...register('content')}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            resize: 'vertical',
          }}
        />
        {errors.content && (
          <p role="alert" style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
            {errors.content.message}
          </p>
        )}
      </div>

      {/* 닉네임 입력 필드 */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="authorNickname"
          style={{ display: 'block', color: '#ccc', marginBottom: '4px' }}
        >
          닉네임
        </label>
        <input
          id="authorNickname"
          type="text"
          placeholder="닉네임을 입력하세요"
          {...register('authorNickname')}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#1a1a2e',
            color: '#fff',
          }}
        />
        {errors.authorNickname && (
          <p role="alert" style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>
            {errors.authorNickname.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={createPlanet.isPending}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: createPlanet.isPending ? '#555' : '#4a90d9',
          color: '#fff',
          cursor: createPlanet.isPending ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
      >
        {createPlanet.isPending ? '작성 중...' : '게시글 작성'}
      </button>
    </form>
  );
}
