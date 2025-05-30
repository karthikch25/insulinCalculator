import { useState } from "react";
import { Calculator, Download, ArrowRight, Stethoscope, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Module1 } from "@/components/calculator/module1";
import { Module2 } from "@/components/calculator/module2";
import { Module3 } from "@/components/calculator/module3";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ModuleType = "selection" | "module1" | "module2" | "module3";

export default function InsulinCalculator() {
  const [currentView, setCurrentView] = useState<ModuleType>("selection");
  const { toast } = useToast();

  const modules = [
    {
      id: "module1" as const,
      title: "New Insulin Initiation",
      description: "Calculate initial insulin dosing for insulin-naive patients",
      subtitle: "For patients starting insulin therapy",
      icon: Stethoscope,
      color: "bg-green-500",
      borderColor: "border-green-200",
      bgColor: "bg-green-50"
    },
    {
      id: "module2" as const,
      title: "Home Insulin Conversion",
      description: "Convert home insulin regimen to hospital protocol",
      subtitle: "For patients with existing insulin regimens",
      icon: Home,
      color: "bg-blue-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50"
    },
    {
      id: "module3" as const,
      title: "In-Hospital Adjustment",
      description: "Adjust existing insulin regimen based on glucose patterns",
      subtitle: "For ongoing insulin optimization",
      icon: Settings,
      color: "bg-red-500",
      borderColor: "border-red-200",
      bgColor: "bg-red-50"
    }
  ];

  const handleDownload = async () => {
    if (currentView === "selection") return;
    
    try {
      const selectedModule = modules.find(m => m.id === currentView);
      const moduleName = selectedModule?.title || "";

      // Get all calculated values from the active module
      const activeModule = document.querySelector('.calculator-content');
      const results: string[] = [];
      
      if (activeModule) {
        const resultElements = activeModule.querySelectorAll('.bg-slate-50, .bg-blue-50, .bg-green-50, .bg-orange-50, .bg-red-50, .bg-gray-50');
        resultElements.forEach(el => {
          const label = el.querySelector('.text-slate-700')?.textContent || '';
          const value = el.querySelector('.font-semibold')?.textContent || '';
          if (label && value && !value.includes('--')) {
            results.push(`${label}: ${value}`);
          }
        });
      }

      const summaryData = {
        moduleName,
        timestamp: new Date().toLocaleString(),
        results
      };

      const response = await apiRequest('POST', '/api/download-summary', summaryData);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `insulin-calculator-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Summary Downloaded",
        description: "Calculator summary has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download summary. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderModuleSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Select Calculation Module</h2>
        <p className="text-slate-600">Choose the appropriate insulin calculation for your clinical scenario</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card
              key={module.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${module.borderColor} border-2`}
              onClick={() => setCurrentView(module.id)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{module.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{module.subtitle}</p>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{module.description}</p>
                
                <div className="flex items-center text-sm font-medium text-slate-700 group">
                  <span>Start Calculation</span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderModule = () => {
    switch (currentView) {
      case "module1":
        return <Module1 />;
      case "module2":
        return <Module2 />;
      case "module3":
        return <Module3 />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Calculator className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Inpatient Insulin Calculator</h1>
                <p className="text-xs text-slate-500">ADA 2025 Guidelines</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {currentView !== "selection" && (
                <Button
                  onClick={() => setCurrentView("selection")}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Back to Modules
                </Button>
              )}
              
              {currentView !== "selection" && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === "selection" ? (
          renderModuleSelection()
        ) : (
          <div className="calculator-content">
            {renderModule()}
          </div>
        )}
      </main>
    </div>
  );
}
