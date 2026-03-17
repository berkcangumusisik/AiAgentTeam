import { Lightbulb } from "lucide-react";

interface TeamSuggestionsProps {
  suggestions: string[];
}

export function TeamSuggestions({ suggestions }: TeamSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3"
        >
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-blue-500" />
          <p className="text-sm text-muted-foreground">{suggestion}</p>
        </div>
      ))}
    </div>
  );
}
