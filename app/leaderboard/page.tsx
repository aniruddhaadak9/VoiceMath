"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { id: 1, username: 'MathWhiz', score: 980, solved: 45 },
  { id: 2, username: 'NumberNinja', score: 850, solved: 38 },
  { id: 3, username: 'QuizMaster', score: 720, solved: 32 },
  { id: 4, username: 'VoiceGenius', score: 690, solved: 30 },
  { id: 5, username: 'MathExplorer', score: 650, solved: 28 },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top performers in VoiceMath challenges
          </p>
        </div>

        <div className="space-y-4">
          {MOCK_LEADERBOARD.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {index === 0 ? (
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="h-6 w-6 text-gray-400" />
                      ) : index === 2 ? (
                        <Award className="h-6 w-6 text-amber-600" />
                      ) : (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.solved} problems solved
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{user.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}