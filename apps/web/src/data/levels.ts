import coordinateGeometryLevels from './levels/coordinateGeometryLevels.json';
import trigonometryLevels from './levels/trigonometryLevels.json';
import applicationsTrigLevels from './levels/applicationsTrigLevels.json';
import surfaceAreaVolumeLevels from './levels/surfaceAreaVolumeLevels.json';
import arithmeticProgressionLevels from './levels/arithmeticProgressionLevels.json';
import probabilityLevels from './levels/probabilityLevels.json';
import trianglesLevels from './levels/trianglesLevels.json';
import circleLevels from './levels/circleLevels.json';
import statisticsLevels from './levels/statisticsLevels.json';
import areasCircleLevels from './levels/areasCircleLevels.json';
import realNumbersLevels from './levels/realNumbersLevels.json';
import polynomialLevels from './levels/polynomialLevels.json';
import linearEquationsLevels from './levels/linearEquationsLevels.json';

export interface LevelData {
  id: string;
  world: number;
  type: string;
  title: string;
  shape: string;
  targetValue: number;
  concept: string;
}

const levels: LevelData[] = [
  ...(surfaceAreaVolumeLevels as LevelData[]),
  ...(coordinateGeometryLevels as LevelData[]),
  ...(trigonometryLevels as LevelData[]),
  ...(applicationsTrigLevels as LevelData[]),
  ...(arithmeticProgressionLevels as LevelData[]),
  ...(probabilityLevels as LevelData[]),
  ...(trianglesLevels as LevelData[]),
  ...(circleLevels as LevelData[]),
  ...(areasCircleLevels as LevelData[]),
  ...(statisticsLevels as LevelData[]),
  ...(realNumbersLevels as LevelData[]),
  ...(polynomialLevels as LevelData[]),
  ...(linearEquationsLevels as LevelData[])
];

export default levels;
