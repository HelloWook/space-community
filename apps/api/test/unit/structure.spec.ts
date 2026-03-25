import * as fs from 'fs';
import * as path from 'path';

// 헥사고날 디렉토리 구조 검증
describe('헥사고날 아키텍처 구조', () => {
  const srcDir = path.resolve(__dirname, '../../src');

  const requiredDirs = [
    'modules',
    'infrastructure/database',
    'infrastructure/config',
    'infrastructure/health',
    'common/exceptions',
    'common/decorators',
    'common/guards',
  ];

  it.each(requiredDirs)('src/%s 디렉토리가 존재해야 한다', (dir) => {
    const dirPath = path.join(srcDir, dir);
    expect(fs.existsSync(dirPath)).toBe(true);
  });
});
