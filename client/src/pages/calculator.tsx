import { useState } from "react";
import { Calculator, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Module1 } from "@/components/calculator/module1";
import { Module2 } from "@/components/calculator/module2";
import { Module3 } from "@/components/calculator/module3";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function InsulinCalculator() {
  const [activeTab, setActiveTab] = useState("module1");
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const moduleName = activeTab === "module1" ? "New Insulin Initiation" : 
                        activeTab === "module2" ? "Home Insulin Conversion" : 
                        "In-Hospital Adjustment";

      // Get all calculated values from the active module
      const activeModule = document.querySelector(`[data-state="active"]`);
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
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Summary
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg mb-6">
            <TabsTrigger value="module1" className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>New Initiation</span>
            </TabsTrigger>
            <TabsTrigger value="module2" className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Home Conversion</span>
            </TabsTrigger>
            <TabsTrigger value="module3" className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>In-Hospital Adjustment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="module1">
            <Module1 />
          </TabsContent>

          <TabsContent value="module2">
            <Module2 />
          </TabsContent>

          <TabsContent value="module3">
            <Module3 />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
