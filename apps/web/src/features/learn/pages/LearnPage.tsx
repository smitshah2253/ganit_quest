import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { CoordinateGrid } from '../animations/CoordinateGrid';
import { PointPlotter } from '../animations/PointPlotter';
import { DistanceVisualizer } from '../animations/DistanceVisualizer';
import { Paywall } from '../components/Paywall';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useAuthStore } from '@/store/auth.store';

interface LearnModule {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isPremium: boolean;
}

const CHAPTER_CONTENT: Record<string, { title: string; modules: LearnModule[] }> = {
  'ch-2': {
    title: 'Polynomials',
    modules: [
      {
        id: 'poly-coming',
        title: 'Coming Soon',
        description: 'Interactive polynomial graphs and algebra generators',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  },
  'ch-6': {
    title: 'Triangles',
    modules: [
      {
        id: 'triangles-intro',
        title: 'Similar Triangles & Scaling',
        description: 'Explore triangle similarity, scale factors, and area ratios through interactive visualizations',
        component: <ComingSoon />,
        isPremium: false
      },
      {
        id: 'bpt-visualizer',
        title: 'Basic Proportionality Theorem',
        description: 'Visualize how parallel lines divide triangle sides proportionally',
        component: <ComingSoon />,
        isPremium: true
      },
      {
        id: 'pythagoras-lab',
        title: 'Pythagorean Theorem Lab',
        description: 'Interactive proofs and applications of the Pythagorean theorem',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  },
  'ch-7': {
    title: 'Coordinate Geometry',
    modules: [
      {
        id: 'grid-intro',
        title: 'The Cartesian Grid',
        description: 'Explore the coordinate system with X and Y axes',
        component: <CoordinateGridPreview />,
        isPremium: false
      },
      {
        id: 'point-plotter',
        title: 'Interactive Point Plotter',
        description: 'Click anywhere on the grid to plot points and see their coordinates',
        component: <PointPlotter />,
        isPremium: false
      },
      {
        id: 'distance-formula',
        title: 'Distance Formula Visualizer',
        description: 'See how the distance formula comes from the Pythagorean theorem',
        component: <DistanceVisualizer />,
        isPremium: true
      }
    ]
  },
  'ch-5': {
    title: 'Arithmetic Progressions',
    modules: [
      {
        id: 'ap-coming',
        title: 'Coming Soon',
        description: 'Interactive sequence generator and visualizer',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  },
  'ch-8': {
    title: 'Trigonometry',
    modules: [
      {
        id: 'trig-coming',
        title: 'Coming Soon',
        description: 'Unit circle explorer and trigonometric wave generator',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  },
  'ch-9': {
    title: 'Some Applications of Trigonometry',
    modules: [
      {
        id: 'survey-aim-lab',
        title: 'Survey Aiming & Angles',
        description: 'Visualize angles of elevation and depression interactively',
        component: <ComingSoon />,
        isPremium: false
      }
    ]
  },
  'ch-12': {
    title: 'Surface Areas & Volumes',
    modules: [
      {
        id: 'volume-coming',
        title: 'Coming Soon',
        description: '3D solid unfolding animations',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  },
  'ch-14': {
    title: 'Probability',
    modules: [
      {
        id: 'prob-coming',
        title: 'Coming Soon',
        description: 'Interactive probability simulations',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  },
  'ch-10': {
    title: 'Circles',
    modules: [
      {
        id: 'circles-intro',
        title: 'Circle & Tangent Foundations',
        description: 'Understand the concept of a tangent and its relationship with the circle radius',
        component: <ComingSoon />,
        isPremium: false
      },
      {
        id: 'radius-tangent-perpendicular',
        title: 'Radius-Tangent Theorem Lab',
        description: 'Visualize why the tangent is always perpendicular (90°) to the radius at the point of contact',
        component: <ComingSoon />,
        isPremium: true
      },
      {
        id: 'equal-tangents-lab',
        title: 'Equal Tangents Theorem Lab',
        description: 'Interactive geometry to show that tangents from an external point are equal in length',
        component: <ComingSoon />,
        isPremium: true
      }
    ]
  }
};

function CoordinateGridPreview() {
  return (
    <div className="flex justify-center py-4">
      <CoordinateGrid points={[
        { x: 3, y: 4, label: 'A' },
        { x: -2, y: 3, label: 'B' },
        { x: -4, y: -2, label: 'C' },
        { x: 2, y: -3, label: 'D' }
      ]} />
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="text-center py-8 text-slate-500">
      <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>Interactive animation coming soon!</p>
    </div>
  );
}

export const LearnPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { isSubscribed, checkSubscription } = useSubscriptionStore();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);

  const chapter = CHAPTER_CONTENT[chapterId || ''];

  useEffect(() => {
    if (token && !hasCheckedSubscription) {
      checkSubscription(token);
      setHasCheckedSubscription(true);
    }
  }, [token, hasCheckedSubscription, checkSubscription]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Chapter not found</h2>
          <button
            onClick={() => navigate('/chapters')}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold"
          >
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  const freeModules = chapter.modules.filter(m => !m.isPremium);
  const premiumModules = chapter.modules.filter(m => m.isPremium);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-10 pt-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate(`/chapter/${chapterId}`)}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Chapter
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Learn: {chapter.title}</h1>
            <p className="text-slate-600">Interactive animations to master concepts</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Free Modules */}
        {freeModules.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Free Content
            </h2>
            <div className="space-y-4">
              {freeModules.map((module) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">{module.title}</h3>
                        <p className="text-sm text-slate-600">{module.description}</p>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          activeModule === module.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                  
                  {activeModule === module.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-slate-100"
                    >
                      {module.component}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Premium Modules or Paywall */}
        {premiumModules.length > 0 && !isSubscribed && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              Premium Content
            </h2>
            <Paywall 
              previewContent={
                premiumModules[0]?.component || <ComingSoon />
              }
              onSubscribe={() => {
                // Refresh subscription status
                if (token) checkSubscription(token);
              }}
            />
          </section>
        )}

        {premiumModules.length > 0 && isSubscribed && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              Premium Content (Unlocked)
            </h2>
            <div className="space-y-4">
              {premiumModules.map((module) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">{module.title}</h3>
                        <p className="text-sm text-slate-600">{module.description}</p>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          activeModule === module.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                  
                  {activeModule === module.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-slate-100"
                    >
                      {module.component}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
