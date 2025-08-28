"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  BarChart3, 
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface AnalysisResult {
  type: string;
  status: 'completed' | 'processing' | 'failed';
  confidence?: number;
  data?: any;
}

interface AnalysisDisplayProps {
  result: AnalysisResult;
  onNewAnalysis?: () => void;
}

export default function AnalysisDisplay({ result, onNewAnalysis }: AnalysisDisplayProps) {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getTypeIcon = () => {
    switch (result.type) {
      case 'financial':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'compliance':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'forecasting':
        return <BarChart3 className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderFinancialAnalysis = () => {
    if (!result.data) return null;
    
    return (
      <div className="space-y-4">
        {result.data.key_metrics && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(result.data.key_metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                <div className="text-lg font-semibold">{value as string}</div>
              </div>
            ))}
          </div>
        )}
        
        {result.data.key_insights && (
          <div>
            <h4 className="font-medium mb-2">Key Insights</h4>
            <ul className="space-y-1">
              {result.data.key_insights.map((insight: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderRiskAnalysis = () => {
    if (!result.data) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Risk Level</span>
          <Badge 
            variant={result.data.risk_level === 'High' ? 'destructive' : 
                    result.data.risk_level === 'Medium' ? 'default' : 'secondary'}
          >
            {result.data.risk_level}
          </Badge>
        </div>
        
        {result.data.risk_score && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Risk Score</span>
              <span className="text-sm font-medium">{result.data.risk_score}/10</span>
            </div>
            <Progress value={result.data.risk_score * 10} className="h-2" />
          </div>
        )}

        {result.data.risk_factors && (
          <div>
            <h4 className="font-medium mb-2">Risk Factors</h4>
            <ul className="space-y-1">
              {result.data.risk_factors.map((factor: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <AlertTriangle className="w-3 h-3 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderComplianceAnalysis = () => {
    if (!result.data) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <Badge 
            variant={result.data.compliance_status === 'Compliant' ? 'default' : 'destructive'}
          >
            {result.data.compliance_status}
          </Badge>
        </div>
        
        {result.data.compliance_score && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Compliance Score</span>
              <span className="text-sm font-medium">{(result.data.compliance_score * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.data.compliance_score * 100} className="h-2" />
          </div>
        )}

        {result.data.regulations_checked && (
          <div>
            <h4 className="font-medium mb-2">Regulations Checked</h4>
            <div className="flex flex-wrap gap-2">
              {result.data.regulations_checked.map((regulation: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {regulation}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderForecastingAnalysis = () => {
    if (!result.data) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {result.data.revenue_forecast && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600">Revenue Forecast</div>
              <div className="text-lg font-semibold text-green-700">{result.data.revenue_forecast}</div>
            </div>
          )}
          
          {result.data.profit_forecast && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600">Profit Forecast</div>
              <div className="text-lg font-semibold text-blue-700">{result.data.profit_forecast}</div>
            </div>
          )}
        </div>

        {result.data.growth_projections && (
          <div>
            <h4 className="font-medium mb-2">Growth Projections</h4>
            <div className="space-y-2">
              {Object.entries(result.data.growth_projections).map(([term, projection]) => (
                <div key={term} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{term.replace('_', ' ')}</span>
                  <span>{projection as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (result.type) {
      case 'financial':
        return renderFinancialAnalysis();
      case 'risk':
        return renderRiskAnalysis();
      case 'compliance':
        return renderComplianceAnalysis();
      case 'forecasting':
        return renderForecastingAnalysis();
      default:
        return <div className="text-sm text-gray-600">Analysis completed successfully.</div>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <CardTitle className="capitalize">{result.type} Analysis</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {result.confidence && (
              <Badge variant="secondary">
                {(result.confidence * 100).toFixed(1)}% confidence
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {result.status === 'processing' ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Processing your analysis...</p>
            </div>
          </div>
        ) : result.status === 'failed' ? (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">Analysis failed. Please try again.</p>
            {onNewAnalysis && (
              <Button onClick={onNewAnalysis} variant="outline" size="sm">
                Retry Analysis
              </Button>
            )}
          </div>
        ) : (
          <div>
            {renderContent()}
            {onNewAnalysis && (
              <div className="mt-6 pt-4 border-t">
                <Button onClick={onNewAnalysis} variant="outline" size="sm">
                  Run New Analysis
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
