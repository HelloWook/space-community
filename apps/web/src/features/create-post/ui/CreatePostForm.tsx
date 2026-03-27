'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, type CreatePostFormData } from '../model/schema';
import { useCreatePlanet } from '@/entities/planet';
import { CustomizePanel, defaultAppearance } from '@/features/customize-planet';
import type { PlanetAppearanceFormData } from '@/features/customize-planet';
import { PlanetPreview3D } from '@/entities/planet/ui/PlanetPreview3D';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';

interface CreatePostFormProps {
  /** 게시글이 속할 은하 ID */
  galaxyId: string;
  /** 생성 성공 시 콜백 */
  onSuccess?: () => void;
}

// 게시글(행성) 작성 폼 컴포넌트 — 외형 커스터마이징 포함
export function CreatePostForm({ galaxyId, onSuccess }: CreatePostFormProps) {
  const [appearance, setAppearance] = useState<PlanetAppearanceFormData>(defaultAppearance);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      appearance: defaultAppearance,
    },
  });

  const createPlanet = useCreatePlanet();

  // 폼 제출 핸들러
  const onSubmit = (data: CreatePostFormData) => {
    createPlanet.mutate(
      {
        galaxyId,
        data: {
          title: data.title,
          content: data.content,
          ...appearance,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="create-post-form">
      {/* 2단 레이아웃: 좌측 프리뷰+커스터마이즈, 우측 입력 폼 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 좌측: 3D 행성 프리뷰 + 커스터마이즈 패널 */}
        <div className="md:w-1/2">
          <h4 className="text-foreground text-sm mb-2">행성 외형</h4>
          <PlanetPreview3D {...appearance} />
          <CustomizePanel appearance={appearance} onChange={setAppearance} />
        </div>

        {/* 우측: 제목 + 내용 입력 + 제출 버튼 */}
        <div className="md:w-1/2 flex flex-col">
          {/* 제목 입력 필드 */}
          <div className="mb-3">
            <label htmlFor="title" className="block text-muted-foreground mb-1">
              제목
            </label>
            <Input
              id="title"
              type="text"
              placeholder="제목을 입력하세요"
              {...register('title')}
            />
            {errors.title && (
              <p role="alert" className="text-destructive text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 내용 입력 필드 */}
          <div className="mb-4 flex-1">
            <label htmlFor="content" className="block text-muted-foreground mb-1">
              내용
            </label>
            <Textarea
              id="content"
              placeholder="내용을 입력하세요"
              rows={6}
              className="h-full min-h-[150px]"
              {...register('content')}
            />
            {errors.content && (
              <p role="alert" className="text-destructive text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            disabled={createPlanet.isPending}
            className="w-full"
          >
            {createPlanet.isPending ? '작성 중...' : '게시글 작성'}
          </Button>
        </div>
      </div>
    </form>
  );
}
