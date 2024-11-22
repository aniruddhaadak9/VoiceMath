"use client";

import { motion } from "framer-motion";
import { Heart, Github } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <motion.div
            className="flex items-center space-x-1 text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.div>
            <span>by</span>
            <a
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-primary hover:underline"
            >
              <span>Aniruddha Adak</span>
              <Github className="h-4 w-4" />
            </a>
          </motion.div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VoiceMath. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
