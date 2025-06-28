import React from 'react';
import { X, Clock, Heart, Folder, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { formatDuration } from '../utils/audioAnalysis';
import { CategoryType } from '../types';

interface StatsPanelProps {
  stats: {
    totalNotes: number;
    totalDuration: number;
    favoriteCount: number;
    categoryStats: Record<CategoryType, number>;
  };
  onClose: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, onClose }) => {
  const mostUsedCategory = Object.entries(stats.categoryStats).reduce(
    (max, [category, count]) => count > max.count ? { category: category as CategoryType, count } : max,
    { category: 'random' as CategoryType, count: 0 }
  );

  const averageDuration = stats.totalNotes > 0 ? stats.totalDuration / stats.totalNotes : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Your Voice Note Statistics
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Total Notes</h3>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalNotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Total Duration</h3>
                  <p className="text-2xl font-bold text-green-900">{formatDuration(stats.totalDuration)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-800">Favorites</h3>
                  <p className="text-2xl font-bold text-pink-900">{stats.favoriteCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">Most Used</h3>
                  <p className="text-lg font-bold text-purple-900">
                    {CATEGORIES.find(c => c.id === mostUsedCategory.category)?.emoji} {' '}
                    {CATEGORIES.find(c => c.id === mostUsedCategory.category)?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-4">Category Distribution</h3>
              <div className="space-y-3">
                {CATEGORIES.map(category => {
                  const count = stats.categoryStats[category.id] || 0;
                  const percentage = stats.totalNotes > 0 ? (count / stats.totalNotes) * 100 : 0;
                  
                  return (
                    <div key={category.id} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center space-x-1">
                          <span>{category.emoji}</span>
                          <span className="font-medium text-orange-800">{category.name}</span>
                        </span>
                        <span className="font-semibold text-orange-900">{count}</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <h4 className="font-semibold text-gray-700 text-sm">Average Duration</h4>
            <p className="text-lg font-bold text-gray-900">{formatDuration(averageDuration)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <h4 className="font-semibold text-gray-700 text-sm">Favorite Rate</h4>
            <p className="text-lg font-bold text-gray-900">
              {stats.totalNotes > 0 ? Math.round((stats.favoriteCount / stats.totalNotes) * 100) : 0}%
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <h4 className="font-semibold text-gray-700 text-sm">Categories Used</h4>
            <p className="text-lg font-bold text-gray-900">
              {Object.keys(stats.categoryStats).filter(cat => stats.categoryStats[cat as CategoryType] > 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};