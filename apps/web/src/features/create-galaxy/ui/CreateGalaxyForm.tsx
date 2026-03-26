'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createGalaxySchema,
  type CreateGalaxyFormData,
} from '../model/schema';
import { useCreateGalaxy } from '@/entities/galaxy';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

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
      <div className="mb-3">
        <label htmlFor="galaxy-name" className="block text-muted-foreground mb-1">
          이름
        </label>
        <Input
          id="galaxy-name"
          type="text"
          placeholder="은하계 이름을 입력하세요"
          {...register('name')}
        />
        {errors.name && (
          <p role="alert" className="text-destructive text-xs mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 설명 입력 필드 */}
      <div className="mb-4">
        <label htmlFor="galaxy-description" className="block text-muted-foreground mb-1">
          설명
        </label>
        <Textarea
          id="galaxy-description"
          placeholder="은하계 설명을 입력하세요"
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p role="alert" className="text-destructive text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        disabled={createGalaxy.isPending}
        className="w-full"
      >
        {createGalaxy.isPending ? '생성 중...' : '은하계 만들기'}
      </Button>
    </form>
  );
}
