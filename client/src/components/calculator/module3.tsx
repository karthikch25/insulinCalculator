import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipWrapper } from "./tooltip-wrapper";
import { AlertTriangle } from "lucide-react";

export function Module3() {
  const [currentTdd, setCurrentTdd] = useState<string>("");
  const [currentGlucose, setCurrentGlucose] = useState<string>("");
  const [targetGlucose, setTargetGlucose] = useState<string>("140");
  const [highReadings, setHighReadings] = useState<boolean>(false);
  const [lowReadings, setLowReadings] = useState<boolean>(false);

  const calculations = () => {
    const currentTddNum = parseFloat(currentTdd) || 0;
    const currentGlucoseNum = parseFloat(currentGlucose) || 0;
    const targetGlucoseNum = parseFloat(targetGlucose) || 140;

    if (currentTddNum > 0) {
      let adjustedTdd = currentTddNum;
      let adjustmentText = "No adjustment";

      if (lowReadings) {
        adjustedTdd = currentTddNum * 0.8;
        adjustmentText = "Decreased by 20%";
      } else if (highReadings) {
        adjustedTdd = currentTddNum * 1.2;
        adjustmentText = "Increased by 20%";
      }

      const isf = 1800 / adjustedTdd;
      const correction = currentGlucoseNum > targetGlucoseNum ? (currentGlucoseNum - targetGlucoseNum) / isf : 0;

      return {
        adjustedTdd: adjustedTdd.toFixed(1),
        isf: isf.toFixed(0),
        correction: correction.toFixed(1),
        adjustmentText,
        hasAdjustment: adjustmentText !== "No adjustment",
      };
    }

    return {
      adjustedTdd: "--",
      isf: "--",
      correction: "--",
      adjustmentText: "",
      hasAdjustment: false,
    };
  };

  const results = calculations();

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">In-Hospital Adjustment + Correction</h2>
          <p className="text-slate-600">Adjust existing insulin regimen based on glucose patterns</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Current Regimen</h3>

            <div>
              <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                Current Total Daily Dose
                <TooltipWrapper content="Current total daily insulin dose" />
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="45"
                  min="1"
                  max="200"
                  value={currentTdd}
                  onChange={(e) => setCurrentTdd(e.target.value)}
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
                    placeholder="180"
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
                  <TooltipWrapper content="Target blood glucose level" />
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

            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Recent Glucose Patterns</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="high"
                    checked={highReadings}
                    onCheckedChange={(checked) => setHighReadings(!!checked)}
                  />
                  <Label htmlFor="high" className="text-sm text-slate-700">>2 glucose readings >200 mg/dL</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="low"
                    checked={lowReadings}
                    onCheckedChange={(checked) => setLowReadings(!!checked)}
                  />
                  <Label htmlFor="low" className="text-sm text-slate-700">Any glucose &lt;70 mg/dL</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Adjusted Regimen</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Adjusted TDD</span>
                  <span className="text-lg font-semibold text-slate-900">{results.adjustedTdd} units</span>
                </div>
                <p className="text-xs text-slate-500">TDD × adjustment factor</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Insulin Sensitivity Factor</span>
                  <span className="text-lg font-semibold caution-orange">{results.isf} mg/dL/unit</span>
                </div>
                <p className="text-xs text-slate-500">1800 ÷ Adjusted TDD</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Correction Dose</span>
                  <span className="text-lg font-semibold alert-red">{results.correction} units</span>
                </div>
                <p className="text-xs text-slate-500">(Current - Target) ÷ ISF</p>
              </div>

              {results.hasAdjustment && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Adjustment</span>
                    <span className="text-sm font-semibold text-slate-900">{results.adjustmentText}</span>
                  </div>
                  <p className="text-xs text-slate-500">Based on glucose patterns</p>
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Adjustment Guidelines</h4>
                  <ul className="text-xs text-red-700 mt-1 space-y-1">
                    <li>• Increase TDD by 20% if >2 readings >200 mg/dL</li>
                    <li>• Decrease TDD by 20% if any reading &lt;70 mg/dL</li>
                    <li>• Review carbohydrate intake and timing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
