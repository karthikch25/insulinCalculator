import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Info } from "lucide-react";

export function Module2() {
  const [homeTdd, setHomeTdd] = useState<string>("");
  const [homeRegimen, setHomeRegimen] = useState<string>("");
  const [recentHypoglycemia, setRecentHypoglycemia] = useState<boolean>(false);
  const [organImpairment, setOrganImpairment] = useState<boolean>(false);
  const [isEating, setIsEating] = useState<boolean>(false);

  const calculations = () => {
    const homeTddNum = parseFloat(homeTdd) || 0;

    if (homeTddNum > 0) {
      let adjustedTdd: number;
      if (recentHypoglycemia || organImpairment) {
        adjustedTdd = homeTddNum * 0.7;
      } else {
        adjustedTdd = homeTddNum * 0.8;
      }

      const basal = adjustedTdd * 0.5;
      const nutritional = isEating ? (adjustedTdd * 0.5) / 3 : 0;

      return {
        adjustedTdd: adjustedTdd.toFixed(1),
        basal: basal.toFixed(1),
        nutritional: nutritional.toFixed(1),
      };
    }

    return {
      adjustedTdd: "--",
      basal: "--",
      nutritional: "--",
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

            <div>
              <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                Home Total Daily Dose
                <TooltipWrapper content="Total units of insulin taken at home per day" />
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="40"
                  min="1"
                  max="200"
                  value={homeTdd}
                  onChange={(e) => setHomeTdd(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-2 text-slate-500 text-sm">units</span>
              </div>
            </div>

            <div>
              <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                Home Regimen Type
                <TooltipWrapper content="Type of insulin regimen used at home" />
              </Label>
              <Select value={homeRegimen} onValueChange={setHomeRegimen}>
                <SelectTrigger>
                  <SelectValue placeholder="Select regimen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basal">Basal Only</SelectItem>
                  <SelectItem value="basal-bolus">Basal-Bolus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Risk Factors</h4>
              <div className="space-y-2">
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
                    id="organ"
                    checked={organImpairment}
                    onCheckedChange={(checked) => setOrganImpairment(!!checked)}
                  />
                  <Label htmlFor="organ" className="text-sm text-slate-700">Renal or liver impairment</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eating2"
                    checked={isEating}
                    onCheckedChange={(checked) => setIsEating(!!checked)}
                  />
                  <Label htmlFor="eating2" className="text-sm text-slate-700">Patient eating</Label>
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
                  <span className="text-sm font-medium text-slate-700">Nutritional Insulin (per meal)</span>
                  <span className="text-lg font-semibold safe-green">{results.nutritional} units</span>
                </div>
                <p className="text-xs text-slate-500">Adjusted TDD × 0.5 ÷ 3 (if eating)</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Conversion Notes</h4>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Reduce by 30% if hypoglycemia or organ dysfunction</li>
                    <li>• Reduce by 20% otherwise for safety margin</li>
                    <li>• Monitor closely and titrate as needed</li>
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
