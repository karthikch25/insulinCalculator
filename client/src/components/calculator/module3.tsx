import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipWrapper } from "./tooltip-wrapper";
import { SummaryPanel } from "./summary-panel";
import { AlertTriangle } from "lucide-react";

export function Module3() {
  const [currentBasal, setCurrentBasal] = useState<string>("");
  const [currentBreakfastBolus, setCurrentBreakfastBolus] = useState<string>("");
  const [currentLunchBolus, setCurrentLunchBolus] = useState<string>("");
  const [currentDinnerBolus, setCurrentDinnerBolus] = useState<string>("");
  const [fastingHigh, setFastingHigh] = useState<boolean>(false);
  const [preLunchHigh, setPreLunchHigh] = useState<boolean>(false);
  const [preDinnerHigh, setPreDinnerHigh] = useState<boolean>(false);
  const [postMealHigh, setPostMealHigh] = useState<boolean>(false);
  const [anyHypoglycemia, setAnyHypoglycemia] = useState<boolean>(false);

  const calculations = () => {
    const currentBasalNum = parseFloat(currentBasal) || 0;
    const currentBreakfastBolusNum = parseFloat(currentBreakfastBolus) || 0;
    const currentLunchBolusNum = parseFloat(currentLunchBolus) || 0;
    const currentDinnerBolusNum = parseFloat(currentDinnerBolus) || 0;
    const currentTddNum = currentBasalNum + currentBreakfastBolusNum + currentLunchBolusNum + currentDinnerBolusNum;

    if (currentTddNum > 0) {
      let basalAdjustment = 0;
      let breakfastBolusAdjustment = 0;
      let lunchBolusAdjustment = 0;
      let dinnerBolusAdjustment = 0;
      let recommendations = [];

      // Fasting BG >140 → increase basal by 10–20%
      if (fastingHigh) {
        basalAdjustment = 15; // 15% increase
        recommendations.push("Increase basal by 10-20% (fasting BG >140)");
      }

      // Pre-lunch BG >140 → increase breakfast bolus by 10–15%
      if (preLunchHigh) {
        breakfastBolusAdjustment = 12.5; // 12.5% increase
        recommendations.push("Increase breakfast bolus by 10-15%");
      }

      // Pre-dinner BG >140 → increase lunch bolus by 10–15%
      if (preDinnerHigh) {
        lunchBolusAdjustment = 12.5; // 12.5% increase
        recommendations.push("Increase lunch bolus by 10-15%");
      }

      // Post-meal BG >180 → increase that meal's bolus by 15–20%
      if (postMealHigh) {
        dinnerBolusAdjustment = 17.5; // 17.5% increase for dinner
        recommendations.push("Increase post-meal bolus by 15-20%");
      }

      // Any BG <70 → reduce corresponding insulin by 20%
      if (anyHypoglycemia) {
        basalAdjustment = -20;
        breakfastBolusAdjustment = -20;
        lunchBolusAdjustment = -20;
        dinnerBolusAdjustment = -20;
        recommendations = ["Reduce ALL insulin by 20% due to hypoglycemia"];
      }
      
      const newBasal = currentBasalNum * (1 + basalAdjustment / 100);
      const newBreakfastBolus = currentBreakfastBolusNum * (1 + breakfastBolusAdjustment / 100);
      const newLunchBolus = currentLunchBolusNum * (1 + lunchBolusAdjustment / 100);
      const newDinnerBolus = currentDinnerBolusNum * (1 + dinnerBolusAdjustment / 100);
      const newTdd = newBasal + newBreakfastBolus + newLunchBolus + newDinnerBolus;

      return {
        currentTdd: currentTddNum.toFixed(1),
        currentBasal: currentBasalNum.toFixed(1),
        currentBreakfastBolus: currentBreakfastBolusNum.toFixed(1),
        currentLunchBolus: currentLunchBolusNum.toFixed(1),
        currentDinnerBolus: currentDinnerBolusNum.toFixed(1),
        newTdd: newTdd.toFixed(1),
        newBasal: newBasal.toFixed(1),
        newBreakfastBolus: newBreakfastBolus.toFixed(1),
        newLunchBolus: newLunchBolus.toFixed(1),
        newDinnerBolus: newDinnerBolus.toFixed(1),
        basalAdjustment: basalAdjustment.toFixed(0),
        breakfastAdjustment: breakfastBolusAdjustment.toFixed(0),
        lunchAdjustment: lunchBolusAdjustment.toFixed(0),
        dinnerAdjustment: dinnerBolusAdjustment.toFixed(0),
        recommendations,
        hasChanges: basalAdjustment !== 0 || breakfastBolusAdjustment !== 0 || lunchBolusAdjustment !== 0 || dinnerBolusAdjustment !== 0,
      };
    }

    return {
      currentTdd: "--",
      currentBasal: "--",
      currentBreakfastBolus: "--",
      currentLunchBolus: "--",
      currentDinnerBolus: "--",
      newTdd: "--",
      newBasal: "--", 
      newBreakfastBolus: "--",
      newLunchBolus: "--",
      newDinnerBolus: "--",
      basalAdjustment: "0",
      breakfastAdjustment: "0",
      lunchAdjustment: "0",
      dinnerAdjustment: "0",
      recommendations: [],
      hasChanges: false,
    };
  };

  const results = calculations();

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">In-Hospital Adjustment</h2>
          <p className="text-slate-600">Adjust existing insulin regimen based on glucose patterns</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Current Regimen</h3>

            <div>
              <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                Current Basal Dose
                <TooltipWrapper content="Current daily basal insulin dose (long-acting)" />
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="20"
                  min="0"
                  max="100"
                  value={currentBasal}
                  onChange={(e) => setCurrentBasal(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Breakfast Bolus
                  <TooltipWrapper content="Current breakfast bolus insulin dose" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="8"
                    min="0"
                    max="50"
                    value={currentBreakfastBolus}
                    onChange={(e) => setCurrentBreakfastBolus(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Lunch Bolus
                  <TooltipWrapper content="Current lunch bolus insulin dose" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="10"
                    min="0"
                    max="50"
                    value={currentLunchBolus}
                    onChange={(e) => setCurrentLunchBolus(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Dinner Bolus
                  <TooltipWrapper content="Current dinner bolus insulin dose" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="12"
                    min="0"
                    max="50"
                    value={currentDinnerBolus}
                    onChange={(e) => setCurrentDinnerBolus(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">BG Patterns (Past 2 Days)</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fastingHigh"
                    checked={fastingHigh}
                    onCheckedChange={(checked) => setFastingHigh(!!checked)}
                  />
                  <Label htmlFor="fastingHigh" className="text-sm text-slate-700">
                    Fasting BG {'>'}140 → increase basal by 10–20%
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preLunchHigh"
                    checked={preLunchHigh}
                    onCheckedChange={(checked) => setPreLunchHigh(!!checked)}
                  />
                  <Label htmlFor="preLunchHigh" className="text-sm text-slate-700">
                    Pre-lunch BG {'>'}140 → increase breakfast bolus by 10–15%
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preDinnerHigh"
                    checked={preDinnerHigh}
                    onCheckedChange={(checked) => setPreDinnerHigh(!!checked)}
                  />
                  <Label htmlFor="preDinnerHigh" className="text-sm text-slate-700">
                    Pre-dinner BG {'>'}140 → increase lunch bolus by 10–15%
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postMealHigh"
                    checked={postMealHigh}
                    onCheckedChange={(checked) => setPostMealHigh(!!checked)}
                  />
                  <Label htmlFor="postMealHigh" className="text-sm text-slate-700">
                    Post-meal BG {'>'}180 → increase that meal's bolus by 15–20%
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hypoglycemia"
                    checked={anyHypoglycemia}
                    onCheckedChange={(checked) => setAnyHypoglycemia(!!checked)}
                  />
                  <Label htmlFor="hypoglycemia" className="text-sm text-red-700 font-medium">
                    Any BG {'<'}70 → reduce corresponding insulin by 20%
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Adjusted Doses</h3>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Current Doses (TDD: {results.currentTdd} units)</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Basal</p>
                  <p className="text-lg font-semibold text-slate-900">{results.currentBasal}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Breakfast</p>
                  <p className="text-lg font-semibold text-slate-900">{results.currentBreakfastBolus}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Lunch</p>
                  <p className="text-lg font-semibold text-slate-900">{results.currentLunchBolus}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Dinner</p>
                  <p className="text-lg font-semibold text-slate-900">{results.currentDinnerBolus}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Adjusted Doses</h4>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Basal</span>
                  <span className="text-lg font-semibold medical-blue">{results.newBasal} units</span>
                </div>
                {results.basalAdjustment !== "0" && (
                  <p className="text-xs mt-1">
                    <span className={results.basalAdjustment.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                      {results.basalAdjustment}% change
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Breakfast Bolus</span>
                  <span className="text-lg font-semibold safe-green">{results.newBreakfastBolus} units</span>
                </div>
                {results.breakfastAdjustment !== "0" && (
                  <p className="text-xs mt-1">
                    <span className={results.breakfastAdjustment.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                      {results.breakfastAdjustment}% change
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Lunch Bolus</span>
                  <span className="text-lg font-semibold safe-green">{results.newLunchBolus} units</span>
                </div>
                {results.lunchAdjustment !== "0" && (
                  <p className="text-xs mt-1">
                    <span className={results.lunchAdjustment.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                      {results.lunchAdjustment}% change
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Dinner Bolus</span>
                  <span className="text-lg font-semibold safe-green">{results.newDinnerBolus} units</span>
                </div>
                {results.dinnerAdjustment !== "0" && (
                  <p className="text-xs mt-1">
                    <span className={results.dinnerAdjustment.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                      {results.dinnerAdjustment}% change
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">New TDD</span>
                <span className="text-lg font-semibold text-purple-600">{results.newTdd} units</span>
              </div>
              <p className="text-xs text-slate-500">Adjusted total daily dose</p>
            </div>

            {results.recommendations.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Recommendations</h4>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">ADA 2025 Pattern Guidelines</h4>
                  <div className="text-xs text-blue-700 space-y-1 leading-relaxed">
                    <p>• High fasting BG {'>'} basal increase 10-20%</p>
                    <p>• High pre/post-meal BG {'>'} bolus increase 10-20%</p>
                    <p>• Any hypoglycemia {'>'} reduce ALL insulin 20%</p>
                    <p>• Wide fluctuations {'>'} consider rebalancing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SummaryPanel 
          data={{
            tdd: results.newTdd,
            basal: results.newBasal,
            breakfastBolus: results.newBreakfastBolus,
            lunchBolus: results.newLunchBolus,
            dinnerBolus: results.newDinnerBolus,
            moduleName: "In-Hospital Adjustment"
          }}
          show={results.newTdd !== "--"}
        />
      </CardContent>
    </Card>
  );
}
