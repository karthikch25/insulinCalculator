import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipWrapper } from "./tooltip-wrapper";
import { SummaryPanel } from "./summary-panel";
import { Info } from "lucide-react";

export function Module4() {
  const [tdd, setTdd] = useState<string>("");
  const [currentGlucose, setCurrentGlucose] = useState<string>("");
  const [targetGlucose, setTargetGlucose] = useState<string>("140");

  const calculations = () => {
    const tddNum = parseFloat(tdd) || 0;
    const currentGlucoseNum = parseFloat(currentGlucose) || 0;
    const targetGlucoseNum = parseFloat(targetGlucose) || 140;

    if (tddNum > 0 && currentGlucoseNum > 0) {
      const isf = 1800 / tddNum;
      const shouldHold = currentGlucoseNum < 100;
      const correction = shouldHold ? 0 : Math.max(0, (currentGlucoseNum - targetGlucoseNum) / isf);

      return {
        isf: isf.toFixed(0),
        correction: correction.toFixed(1),
        shouldHold,
        correctionRounded: Math.round(correction).toString(),
      };
    }

    return {
      isf: "--",
      correction: "--",
      shouldHold: false,
      correctionRounded: "--",
    };
  };

  const results = calculations();

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Correction Dose Calculator</h2>
          <p className="text-slate-600">Calculate insulin correction dose for current glucose levels</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Patient Information</h3>

            <div>
              <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                Total Daily Dose (TDD)
                <TooltipWrapper content="Current or prescribed total daily insulin dose" />
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="45"
                  min="1"
                  max="200"
                  value={tdd}
                  onChange={(e) => setTdd(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Current Glucose
                  <TooltipWrapper content="Current blood glucose level" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="200"
                    min="50"
                    max="600"
                    value={currentGlucose}
                    onChange={(e) => setCurrentGlucose(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">mg/dL</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Target Glucose
                  <TooltipWrapper content="Target blood glucose level (default 140)" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="140"
                    min="80"
                    max="200"
                    value={targetGlucose}
                    onChange={(e) => setTargetGlucose(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">mg/dL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Correction Calculation</h3>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Insulin Sensitivity Factor</span>
                <span className="text-lg font-semibold caution-orange">{results.isf} mg/dL/unit</span>
              </div>
              <p className="text-xs text-slate-500">1800 ÷ TDD</p>
            </div>

            <div className={`rounded-lg p-4 ${results.shouldHold ? 'bg-red-50 border border-red-200' : 'bg-blue-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Correction Dose</span>
                <span className={`text-lg font-semibold ${results.shouldHold ? 'text-red-600' : 'text-blue-600'}`}>
                  {results.shouldHold ? 'HOLD' : `${results.correctionRounded} units`}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {results.shouldHold 
                  ? 'BG < 100 mg/dL - Hold correction'
                  : 'Rounded to nearest whole unit'
                }
              </p>
            </div>

            {!results.shouldHold && results.correction !== "--" && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Exact Calculation</span>
                  <span className="text-lg font-semibold text-slate-600">{results.correction} units</span>
                </div>
                <p className="text-xs text-slate-500">Before rounding</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">ADA 2025 Guidelines</h4>
                  <div className="text-xs text-yellow-700 space-y-1 leading-relaxed">
                    <p>• ISF = 1800 ÷ TDD for rapid-acting insulin</p>
                    <p>• Hold correction if BG {'<'} 100 mg/dL</p>
                    <p>• Round correction dose to nearest whole unit</p>
                    <p>• Monitor response and adjust ISF as needed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SummaryPanel 
          data={{
            correction: results.shouldHold ? "HOLD" : results.correctionRounded,
            moduleName: "Correction Dose"
          }}
          show={results.isf !== "--"}
        />
      </CardContent>
    </Card>
  );
}