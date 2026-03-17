"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProviderConfig } from "@/lib/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ModelSelectorProps {
  providers: ProviderConfig[];
  value: string;
  onChange: (model: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// ModelSelector
// ---------------------------------------------------------------------------
export function ModelSelector({
  providers,
  value,
  onChange,
  placeholder = "Bir model seçin",
  disabled = false,
  className,
}: ModelSelectorProps) {
  // Only show providers that are enabled and have at least one model
  const availableProviders = providers.filter(
    (p) => p.isEnabled && p.models.length > 0
  );

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {availableProviders.length === 0 ? (
          <SelectItem value="__none" disabled>
            Kullanılabilir model yok
          </SelectItem>
        ) : (
          availableProviders.map((provider) => (
            <SelectGroup key={provider.name}>
              <SelectLabel>{provider.displayName}</SelectLabel>
              {provider.models.map((model) => (
                <SelectItem key={`${provider.name}:${model.id}`} value={model.id}>
                  {model.name}
                  {model.contextWindow
                    ? ` (${Math.round(model.contextWindow / 1000)}k)`
                    : ""}
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
