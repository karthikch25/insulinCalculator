import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  content: string;
}

export function TooltipWrapper({ content }: TooltipWrapperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="ml-1 text-slate-400 hover:text-slate-600">
          <Info className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs max-w-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
