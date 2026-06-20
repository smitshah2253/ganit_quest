import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import LevelGrid from '../components/LevelGrid';

const CHAPTER_METADATA: Record<string, { title: string; syllabus: string; fullName: string }> = {
  'ch-1': {
    title: 'Real Numbers',
    fullName: 'Chapter 1: Real Numbers',
    syllabus: 'Syllabus: Prime & composite numbers, factor trees, Euclid\'s Division Lemma and Algorithm, Fundamental Theorem of Arithmetic, HCF and LCM, and irrational numbers. Restore the Number Kingdom to begin.'
  },
  'ch-6': {
    title: 'Triangles',
    fullName: 'Chapter 6: Triangles',
    syllabus: 'Syllabus: Similar triangles, scale factors, corresponding sides, Basic Proportionality Theorem (BPT), area relationships (Area ∝ k²), Pythagorean theorem, and geometric scaling. Select a level to begin.'
  },
  'ch-14': {
    title: 'Probability',
    fullName: 'Chapter 14: Probability',
    syllabus: 'Syllabus: Random experiments, sample spaces, events, favorable outcomes, P(E) = n(E)/n(S), complementary events P(Ē) = 1 − P(E), and experimental probability. Select a level to begin.'
  },
  'ch-5': {
    title: 'Arithmetic Progressions',
    fullName: 'Chapter 5: Arithmetic Progressions',
    syllabus: 'Syllabus: Sequences and series, common difference, nth term formula aₙ = a + (n−1)d, sum of n terms Sₙ = n/2[2a + (n−1)d], and real-world applications. Select a level to begin.'
  },
  'ch-7': {
    title: 'Coordinate Geometry',
    fullName: 'Chapter 7: Coordinate Geometry',
    syllabus: 'Syllabus: Cartesian coordinate plane plotting, reflections, Distance Formula, Midpoint Formula, and Section division ratios. Select a level challenge to begin.'
  },
  'ch-8': {
    title: 'Trigonometry & Applications',
    fullName: 'Chapter 8: Introduction to Trigonometry',
    syllabus: 'Syllabus: Ratios of right-angled triangles, identities sin²θ + cos²θ = 1, complementary angle formulas, and heights & distances applications. Select a level challenge to begin.'
  },
  'ch-9': {
    title: 'Some Applications of Trigonometry',
    fullName: 'Chapter 9: Some Applications of Trigonometry',
    syllabus: 'Syllabus: Line of sight, angle of elevation, angle of depression, height and distance calculations, and real-world surveying, aiming, and navigation. Select a level to begin.'
  },
  'ch-12': {
    title: 'Surface Areas & Volumes',
    fullName: 'Chapter 12: Surface Areas and Volumes',
    syllabus: 'Syllabus: Formulations and transformations of solids—cubes, cuboids, spheres, cones, hemispheres, and combination solids. Select a level challenge to begin.'
  },
  'ch-10': {
    title: 'Circles',
    fullName: 'Chapter 10: Circles',
    syllabus: 'Syllabus: Tangents to a circle, point of contact, theorem: radius is perpendicular to tangent at point of contact (tangent ⟂ radius), theorem: tangent lengths from same external point are equal, and interactive spatial engineering reactor challenges. Select a level to begin.'
  },
  'ch-11': {
    title: 'Areas Related to Circles',
    fullName: 'Chapter 11: Areas Related to Circles',
    syllabus: 'Syllabus: Circumference, area of circle, semicircle, quadrant, sectors, arc length, area of sector, combined circular regions, and practical geometry applications. Select a level to begin.'
  },
  'ch-13': {
    title: 'Statistics',
    fullName: 'Chapter 13: Statistics',
    syllabus: 'Syllabus: Mean (average), Median, Mode of grouped data, cumulative frequency distribution, and graphical representation. Select a level to begin your Data City investigation.'
  }
};

export const LevelGridPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const metadata = CHAPTER_METADATA[chapterId || 'ch-5'] || CHAPTER_METADATA['ch-5'];

  return (
    <div className="h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-10 overflow-y-auto relative select-none pt-20">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-[30rem] sm:h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => navigate(`/chapter/${chapterId}`)}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Back to Intro</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex items-center gap-2 bg-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-emerald-100">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {metadata.fullName}
            </span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2 text-slate-850 tracking-tight">
          {metadata.title}
        </h2>
        <p className="text-slate-500 mb-6 sm:mb-10 text-xs sm:text-sm leading-relaxed max-w-xl font-medium px-1">
          {metadata.syllabus}
        </p>

        <LevelGrid chapterId={chapterId || 'ch-12'} />
      </div>
    </div>
  );
};

export default LevelGridPage;
