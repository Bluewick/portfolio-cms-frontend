import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function Breadcrumb({ items = [], className }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs md:text-sm text-slate-500', className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <li aria-hidden="true" className="text-slate-300">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {isLast || !item.href ? (
                  <span
                    className="font-semibold text-slate-900 line-clamp-1 max-w-[200px] md:max-w-xs"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}