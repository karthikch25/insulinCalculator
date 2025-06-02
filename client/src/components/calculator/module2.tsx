import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipWrapper } from "./tooltip-wrapper";
import { SummaryPanel } from "./summary-panel";
import { Info } from "lucide-react";

export function Module2() {
  const [homeBasal, setHomeBasal] = useState<string>("");
  const [homeBolus, setHomeBolus] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [egfr, setEgfr] = useState<string>("");
  const [liverDysfunction, setLiverDysfunction] = useState<boolean>(false);
  const [recentHypoglycemia, setRecentHypoglycemia] = useState<boolean>(false);
  const [isNpo, setIsNpo] = useState<boolean>(false);

  const calculations = () => {
    const homeBasalNum = parseFloat(homeBasal) || 0;
    const homeBolusNum = parseFloat(homeBolus) || 0;
    const homeTddNum = homeBasalNum + homeBolusNum;
    const ageNum = parseInt(age) || 0;
    const egfrNum = parseInt(egfr) || 100;

    if (homeTddNum > 0) {
      // Count risk factors
      let riskFactors = 0;
      if (ageNum > 65) riskFactors++;
      if (egfrNum < 30) riskFactors++;
      if (liverDysfunction) riskFactors++;
      if (recentHypoglycemia) riskFactors++;
      if (isNpo) riskFactors++;

      // Apply risk-based reduction
      let reductionFactor = 0.8; // Default 20% reduction
      if (riskFactors >= 2) {
        reductionFactor = 0.7; // 30% reduction for 2+ risk factors
      } else if (riskFactors === 1) {
        reductionFactor = 0.8; // 20% reduction for 1 risk factor
      }

      const adjustedTdd = homeTddNum * reductionFactor;
      const basal = adjustedTdd * 0.5;
      const bolus = (adjustedTdd * 0.5) / 3;

      return {
        homeTdd: homeTddNum.toFixed(1),
        adjustedTdd: adjustedTdd.toFixed(1),
        basal: basal.toFixed(1),
        bolus: bolus.toFixed(1),
        riskFactors,
        reductionPercent: ((1 - reductionFactor) * 100).toFixed(0),
      };
    }

    return {
      homeTdd: "--",
      adjustedTdd: "--",
      basal: "--",
      bolus: "--",
      riskFactors: 0,
      reductionPercent: "--",
    };
  };

  const results = calculations();

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Conversion from Home Insulin</h2>
          <p className="text-slate-600">Convert home insulin regimen to hospital protocol</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Home Insulin Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Home Basal Dose
                  <TooltipWrapper content="Total daily basal insulin units taken at home" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="20"
                    min="0"
                    max="100"
                    value={homeBasal}
                    onChange={(e) => setHomeBasal(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Home Bolus Dose
                  <TooltipWrapper content="Total daily bolus insulin units taken at home" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="20"
                    min="0"
                    max="100"
                    value={homeBolus}
                    onChange={(e) => setHomeBolus(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Age
                  <TooltipWrapper content="Patient age in years" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="55"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">years</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  eGFR
                  <TooltipWrapper content="Estimated Glomerular Filtration Rate" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="90"
                    min="1"
                    max="200"
                    value={egfr}
                    onChange={(e) => setEgfr(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">ml/min</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Risk Factors & Clinical Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liver"
                    checked={liverDysfunction}
                    onCheckedChange={(checked) => setLiverDysfunction(!!checked)}
                  />
                  <Label htmlFor="liver" className="text-sm text-slate-700">Liver dysfunction</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hypoglycemia"
                    checked={recentHypoglycemia}
                    onCheckedChange={(checked) => setRecentHypoglycemia(!!checked)}
                  />
                  <Label htmlFor="hypoglycemia" className="text-sm text-slate-700">Recent hypoglycemia</Label>
                </div>



                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="npo"
                    checked={isNpo}
                    onCheckedChange={(checked) => setIsNpo(!!checked)}
                  />
                  <Label htmlFor="npo" className="text-sm text-slate-700">NPO (Nothing by mouth)</Label>
                </div>


              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Converted Doses</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Adjusted TDD</span>
                  <span className="text-lg font-semibold text-slate-900">{results.adjustedTdd} units</span>
                </div>
                <p className="text-xs text-slate-500">Home TDD × adjustment factor</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Basal Insulin</span>
                  <span className="text-lg font-semibold medical-blue">{results.basal} units</span>
                </div>
                <p className="text-xs text-slate-500">Adjusted TDD × 0.5</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Bolus Insulin (per meal)</span>
                  <span className="text-lg font-semibold safe-green">{results.bolus} units</span>
                </div>
                <p className="text-xs text-slate-500">Adjusted TDD × 0.5 ÷ 3 (if eating)</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">ADA 2025 Guidelines</h4>
                  <div className="text-xs text-yellow-700 space-y-1 leading-relaxed">
                    <p>• Risk factors detected: {results.riskFactors}</p>
                    <p>• TDD reduction applied: {results.reductionPercent}%</p>
                    <p>• 1 factor = 20% reduction, 2+ factors = 25-30%</p>
                    <p>• Factors: Age {'>'}65, eGFR {'<'}30, liver dysfunction, hypoglycemia, NPO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SummaryPanel 
          data={{
            tdd: results.adjustedTdd,
            basal: results.basal,
            bolus: results.bolus,
            moduleName: "Home Insulin Conversion"
          }}
          show={results.adjustedTdd !== "--"}
        />
      </CardContent>
    </Card>
  );
}
