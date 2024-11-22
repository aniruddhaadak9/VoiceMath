"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            VoiceMath
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <NavLinks mobile onClick={() => setIsOpen(false)} />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function NavLinks({ mobile, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const links = [
    { href: '/quiz', label: 'Quiz' },
    { href: '/practice', label: 'Practice' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={`${
            mobile
              ? 'block px-4 py-2 text-sm hover:bg-accent rounded-md'
              : 'text-sm font-medium hover:text-primary transition-colors'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}