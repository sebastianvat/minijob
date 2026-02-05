'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Hammer, Wrench, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = [
  { slug: 'curatenie', name: 'Curățenie', icon: Sparkles },
  { slug: 'montaj-mobila', name: 'Montaj Mobilă', icon: Hammer },
  { slug: 'reparatii', name: 'Reparații', icon: Wrench },
];

const suggestions = [
  'curățenie apartament',
  'montaj dulap IKEA',
  'reparații robinet',
  'zugrăvit cameră',
  'mutare mobilier',
];

interface SearchBarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSuggestions?: boolean;
}

export function SearchBar({ className = '', size = 'md', showSuggestions = true }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions.slice(0, 3));
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14 text-lg',
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="Ce serviciu cauți? (ex: curățenie, montaj mobilă)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`pl-12 pr-10 ${sizeClasses[size]} border-slate-200 focus:border-orange-300 focus:ring-orange-200`}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          {/* Quick Categories */}
          <div className="p-3 border-b border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Categorii populare</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} onClick={() => setIsOpen(false)}>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors"
                  >
                    <cat.icon className="w-3 h-3 mr-1" />
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="p-2">
            <p className="text-xs text-slate-500 px-2 mb-1">
              {query ? 'Rezultate' : 'Căutări frecvente'}
            </p>
            {filteredSuggestions.map((suggestion, idx) => (
              <Link 
                key={idx} 
                href={`/categories/curatenie?q=${encodeURIComponent(suggestion)}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{suggestion}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
              </Link>
            ))}
          </div>

          {/* View All */}
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <Link 
              href="/categories"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Vezi toate categoriile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
