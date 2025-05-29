import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipWrapper } from "./tooltip-wrapper";
import { AlertTriangle } from "lucide-react";

export function Module1() {
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [egfr, setEgfr] = useState<string>("");
  const [liverDysfunction, setLiverDysfunction] = useState<boolean>(false);
  const [bmiOver30, setBmiOver30] = useState<boolean>(false);
  const [steroidUse, setSteroidUse] = useState<boolean>(false);
  const [isEating, setIsEating] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<string>("");
  const [currentGlucose, setCurrentGlucose] = useState<string>("");
  const [targetGlucose, setTargetGlucose] = useState<string>("140");

  const [multiplierOptions, setMultiplierOptions] = useState<number[]>([]);

  useEffect(() => {
    const ageNum = parseInt(age) || 0;
    const egfrNum = parseInt(egfr) || 100;

    let options: number[] = [];

    if (ageNum > 65 || egfrNum < 30 || liverDysfunction) {
      options = [0.2, 0.25, 0.3];
    } else if (bmiOver30 || steroidUse) {
      options = [0.6, 0.8, 1.0];
    } else {
      options = [0.4, 0.45, 0.5];
    }

    setMultiplierOptions(options);
    setMultiplier(""); // Reset multiplier when options change
  }, [age, egfr, liverDysfunction, bmiOver30, steroidUse]);

  const calculations = () => {
    const weightNum = parseFloat(weight) || 0;
    const multiplierNum = parseFloat(multiplier) || 0;
    const currentGlucoseNum = parseFloat(currentGlucose) || 0;
    const targetGlucoseNum = parseFloat(targetGlucose) || 140;

    if (weightNum > 0 && multiplierNum > 0) {
      const tdd = weightNum * multiplierNum;
      const basal = tdd * 0.5;
      const nutritional = isEating ? (tdd * 0.5) / 3 : 0;
      const isf = 1800 / tdd;
      const correction = currentGlucoseNum > targetGlucoseNum ? (currentGlucoseNum - targetGlucoseNum) / isf : 0;

      return {
        tdd: tdd.toFixed(1),
        basal: basal.toFixed(1),
        nutritional: nutritional.toFixed(1),
        isf: isf.toFixed(0),
        correction: correction.toFixed(1),
      };
    }

    return {
      tdd: "--",
      basal: "--",
      nutritional: "--",
      isf: "--",
      correction: "--",
    };
  };

  const results = calculations();

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">New Insulin Initiation + Correction Dose</h2>
          <p className="text-slate-600">Calculate initial insulin dosing for insulin-naive patients</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Patient Parameters</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                  Weight
                  <TooltipWrapper content="Patient weight in kilograms" />
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="70"
                    min="1"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-2 text-slate-500 text-sm">kg</span>
                </div>
              </div>

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

            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Clinical Conditions</h4>
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
                    id="bmi"
                    checked={bmiOver30}
                    onCheckedChange={(checked) => setBmiOver30(!!checked)}
                  />
                  <Label htmlFor="bmi" className="text-sm text-slate-700">BMI > 30</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="steroid"
                    checked={steroidUse}
                    onCheckedChange={(checked) => setSteroidUse(!!checked)}
                  />
                  <Label htmlFor="steroid" className="text-sm text-slate-700">Steroid use</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eating"
                    checked={isEating}
                    onCheckedChange={(checked) => setIsEating(!!checked)}
                  />
                  <Label htmlFor="eating" className="text-sm text-slate-700">Patient eating</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                TDD Multiplier
                <TooltipWrapper content="Total Daily Dose multiplier based on patient conditions" />
              </Label>
              <Select value={multiplier} onValueChange={setMultiplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select multiplier" />
                </SelectTrigger>
                <SelectContent>
                  {multiplierOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} units/kg
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">Calculated Doses</h3>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Total Daily Dose (TDD)</span>
                  <span className="text-lg font-semibold text-slate-900">{results.tdd} units</span>
                </div>
                <p className="text-xs text-slate-500">Weight × Selected Multiplier</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Basal Insulin</span>
                  <span className="text-lg font-semibold medical-blue">{results.basal} units</span>
                </div>
                <p className="text-xs text-slate-500">TDD × 0.5</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Nutritional Insulin (per meal)</span>
                  <span className="text-lg font-semibold safe-green">{results.nutritional} units</span>
                </div>
                <p className="text-xs text-slate-500">TDD × 0.5 ÷ 3 (if eating)</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Insulin Sensitivity Factor</span>
                  <span className="text-lg font-semibold caution-orange">{results.isf} mg/dL/unit</span>
                </div>
                <p className="text-xs text-slate-500">1800 ÷ TDD</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Correction Dose</span>
                  <span className="text-lg font-semibold alert-red">{results.correction} units</span>
                </div>
                <p className="text-xs text-slate-500">(Current - Target) ÷ ISF</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Clinical Note</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Monitor blood glucose closely and adjust doses based on patient response. 
                    Consider lower starting doses in elderly or frail patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
