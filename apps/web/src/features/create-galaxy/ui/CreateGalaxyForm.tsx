'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createGalaxySchema,
  type CreateGalaxyFormData,
} from '../model/schema';
import { useCreateGalaxy } from '@/entities/galaxy';

interface CreateGalaxyFormProps {
  /** 생성 성공 시 콜백 */
  onSuccess?: () => void;
}

// 은하계(주제) 생성 폼 컴포넌트
export function CreateGalaxyForm({ onSuccess }: CreateGalaxyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGalaxyFormData>({
    resolver: zodResolver(createGalaxySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createGalaxy = useCreateGalaxy();

  // 폼 제출 핸들러
  const onSubmit = (data: CreateGalaxyFormData) => {
    createGalaxy.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="create-galaxy-form">
      {/* 이름 입력 필드 */}
      <div style={{ marginBottom: '12px' }}>
        <label
          htmlFor="galaxy-name"
          style={{ display: 'block', color: '#ccc', marginBottom: '4px' }}
        >
          이름
        </label>
        <input
          id="galaxy-name"
          type="text"
          placeholder="은하계 이름을 입력하세요"
          {...register('name')}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#1a1a2e',
            color: '#fff',
          }}
        />
        {errors.name && (
          <p
            role="alert"
            style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 설명 입력 필드 */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="galaxy-description"
          style={{ display: 'block', color: '#ccc', marginBottom: '4px' }}
        >
          설명
        </label>
        <textarea
          id="galaxy-description"
          placeholder="은하계 설명을 입력하세요"
          rows={4}
          {...register('description')}
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
        {errors.description && (
          <p
            role="alert"
            style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}
          >
            {errors.description.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={createGalaxy.isPending}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: createGalaxy.isPending ? '#555' : '#4a90d9',
          color: '#fff',
          cursor: createGalaxy.isPending ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
      >
        {createGalaxy.isPending ? '생성 중...' : '은하계 만들기'}
      </button>
    </form>
  );
}
