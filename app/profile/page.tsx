"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Trophy, Star, Activity } from 'lucide-react';

interface UserStats {
  quizzesTaken: number;
  totalCorrect: number;
  highScore: number;
  practiceTime: number;
}

export default function ProfilePage() {
  const [username, setUsername] = useLocalStorage('user-username', '');
  const [stats] = useLocalStorage<UserStats>('user-stats', {
    quizzesTaken: 0,
    totalCorrect: 0,
    highScore: 0,
    practiceTime: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const handleSave = () => {
    setUsername(tempUsername);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-muted-foreground">
            View your progress and customize your profile
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {username || 'Anonymous User'}
                </h2>
                <p className="text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {isEditing && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">High Score</p>
                  <p className="text-2xl font-bold">{stats.highScore}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Quizzes Completed</p>
                  <p className="text-2xl font-bold">{stats.quizzesTaken}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Correct Answers</p>
                  <p className="text-2xl font-bold">{stats.totalCorrect}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            {stats.quizzesTaken > 0 ? (
              <div className="space-y-4">
                <p>Quiz completed with score: {stats.highScore}</p>
                <p>Total correct answers: {stats.totalCorrect}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}