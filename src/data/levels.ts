import coordinateGeometryLevels from './levels/coordinateGeometryLevels.json';
import trigonometryLevels from './levels/trigonometryLevels.json';
import surfaceAreaVolumeLevels from './levels/surfaceAreaVolumeLevels.json';

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
  ...(trigonometryLevels as LevelData[])
];

export default levels;
