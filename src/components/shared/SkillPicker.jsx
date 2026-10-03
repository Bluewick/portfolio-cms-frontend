import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, X, Cpu } from 'lucide-react';
import { api } from '../../lib/api';

export function SkillPicker({
  selectedSkillIds = [],
  onChange,
  label = 'Associated Skills & Stack',
}) {
  const [search, setSearch] = useState('');

  // Query all available skills from backend
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills', 'admin'],
    queryFn: async () => {
      const res = await api.get('/api/admin/skills');
      return res.data?.data || [];
    },
  });

  const selectedSkills = skills.filter((s) => selectedSkillIds.includes(s.id));
  const availableSkills = skills.filter(
    (s) =>
      !selectedSkillIds.includes(s.id) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSkill = (skillId) => {
    onChange([...selectedSkillIds, skillId]);
  };

  const handleRemoveSkill = (skillId) => {
    onChange(selectedSkillIds.filter((id) => id !== skillId));
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Selected Skills Pills */}
      <div className="min-h-11 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex flex-wrap items-center gap-1.5">
        {selectedSkills.length === 0 ? (
          <span className="text-xs text-[#94a3b8] italic px-1">
            No skills linked yet. Click available skills below to attach.
          </span>
        ) : (
          selectedSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] rounded-lg shadow-level-1 animate-in fade-in"
            >
              {skill.icon_url ? (
                <img
                  src={skill.icon_url}
                  alt={skill.name}
                  className="w-3.5 h-3.5 object-contain"
                />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-[#94a3b8]" />
              )}
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] p-0.5 rounded transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Search & Suggestions Dropdown */}
      <div className="relative">
        <div className="flex items-center h-9 px-3 bg-white border border-[#e2e8f0] rounded-lg text-xs gap-2 focus-within:border-[#2563eb] transition-colors">
          <Search className="w-3.5 h-3.5 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search skills to add..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-[#0f172a] placeholder:text-[#94a3b8]"
          />
        </div>

        {/* Suggestion Chips */}
        {availableSkills.length > 0 && (
          <div className="mt-2 max-h-36 overflow-y-auto p-1.5 bg-white border border-[#e2e8f0] rounded-lg shadow-level-1 flex flex-wrap gap-1">
            {availableSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleAddSkill(skill.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8fafc] hover:bg-[#eff6ff] hover:text-[#2563eb] border border-[#e2e8f0] hover:border-[#bfdbfe] text-xs font-medium text-[#475569] rounded-lg transition-colors text-left"
              >
                <Plus className="w-3 h-3" />
                <span>{skill.name}</span>
                <span className="text-[10px] text-[#94a3b8]">({skill.category})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}