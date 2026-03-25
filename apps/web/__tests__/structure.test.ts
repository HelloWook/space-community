import * as fs from 'fs';
import * as path from 'path';

// FSD 레이어 디렉토리 존재 여부 검증
describe('FSD 레이어 구조', () => {
  const srcDir = path.resolve(__dirname, '../src');

  const fsdLayers = [
    'app/providers',
    'app/styles',
    'views',
    'widgets',
    'features',
    'entities',
    'shared/ui',
    'shared/lib',
    'shared/config',
    'shared/types',
  ];

  it.each(fsdLayers)('src/%s 디렉토리가 존재해야 한다', (layer) => {
    const layerPath = path.join(srcDir, layer);
    expect(fs.existsSync(layerPath)).toBe(true);
  });

  const barrelLayers = [
    'views',
    'widgets',
    'features',
    'entities',
    'shared/ui',
    'shared/lib',
    'shared/config',
    'shared/types',
  ];

  it.each(barrelLayers)('src/%s/index.ts barrel export가 존재해야 한다', (layer) => {
    const indexPath = path.join(srcDir, layer, 'index.ts');
    expect(fs.existsSync(indexPath)).toBe(true);
  });
});
