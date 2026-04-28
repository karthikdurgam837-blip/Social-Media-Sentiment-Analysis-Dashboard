import { motion, AnimatePresence } from 'motion/react';
import { AnalyzedPost } from '../types';
import { MessageSquare, ThumbsUp, Share2, Quote } from 'lucide-react';
import { cn } from './ui/Card';

interface Props {
  posts: AnalyzedPost[];
}

export const Feed = ({ posts }: Props) => {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className="group"
          >
            <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{post.author}</h4>
                    <span className="text-xs text-gray-400 font-mono tracking-tight">
                      @{post.platform} • {new Date(post.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest",
                  post.sentiment === 'positive' && "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                  post.sentiment === 'negative' && "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                  post.sentiment === 'neutral' && "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
                )}>
                  {post.sentiment}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed tracking-tight">
                {post.content}
              </p>

              <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-3 mb-4 border border-dashed border-gray-200 dark:border-gray-800 relative">
                <Quote className="absolute -top-2 -left-2 w-4 h-4 text-gray-300 dark:text-gray-700 fill-gray-100 dark:fill-gray-900" />
                <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-snug pl-2">
                  <span className="font-semibold text-gray-400 dark:text-gray-600 mr-1 italic serif uppercase text-[9px] tracking-widest block mb-1">AI INSIGHT</span>
                  {post.explanation}
                </p>
              </div>

              <div className="flex gap-4 mb-4 flex-wrap">
                {post.keywords.map(kw => (
                  <span key={kw} className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 lowercase">
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-mono">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-mono">{post.shares}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
