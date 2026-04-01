"use client";

import { Button } from "@/components/ui/button";

interface RefereeFilterProps {
  fields: string[];
  selectedField: string | null;
  onSelectField: (field: string | null) => void;
}

export function RefereeFilter({ fields, selectedField, onSelectField }: RefereeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      <Button
        variant={selectedField === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectField(null)}
        className="text-[10px] font-bold uppercase"
      >
        Tous les terrains
      </Button>
      {fields.map((field) => (
        <Button
          key={field}
          variant={selectedField === field ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectField(field)}
          className="text-[10px] font-bold uppercase"
        >
          {field}
        </Button>
      ))}
    </div>
  );
}
