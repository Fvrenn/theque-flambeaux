"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RefereeFilterProps {
  fields: string[];
  selectedField: string | null;
  onSelectField: (field: string | null) => void;
  selectedCategory: Category | "ALL";
  onSelectCategory: (category: Category | "ALL") => void;
}

export function RefereeFilter({ 
  fields, 
  selectedField, 
  onSelectField,
  selectedCategory,
  onSelectCategory
}: RefereeFilterProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-center">
        <Tabs 
          value={selectedCategory} 
          onValueChange={(v) => onSelectCategory(v as Category | "ALL")}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ALL" className="text-[10px] font-black uppercase">Tous</TabsTrigger>
            <TabsTrigger value="PF" className="text-[10px] font-black uppercase">Tournoi PF</TabsTrigger>
            <TabsTrigger value="F" className="text-[10px] font-black uppercase">Tournoi F</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedField === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectField(null)}
          className="text-[10px] font-bold uppercase rounded-full px-4"
        >
          Tous les terrains
        </Button>
        {fields.map((field) => (
          <Button
            key={field}
            variant={selectedField === field ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectField(field)}
            className="text-[10px] font-bold uppercase rounded-full px-4"
          >
            {field}
          </Button>
        ))}
      </div>
    </div>
  );
}
