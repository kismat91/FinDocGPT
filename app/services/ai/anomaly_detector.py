import re
import numpy as np
from typing import Dict, Any, List
from statistics import mean, stdev

class AnomalyDetector:
    """Service for detecting anomalies in financial data"""
    
    def __init__(self):
        # Thresholds for anomaly detection
        self.z_score_threshold = 2.0  # Standard deviations for anomaly
        self.percentage_change_threshold = 0.2  # 20% change threshold
    
    async def detect_anomalies(self, text: str) -> Dict[str, Any]:
        """Detect anomalies in financial document text"""
        
        if not text:
            return {
                "anomalies": [],
                "risk_score": 0.0,
                "recommendations": ["No content available for analysis"],
                "affected_metrics": [],
                "confidence": 0.0
            }
        
        # Extract financial metrics
        metrics = self._extract_financial_metrics(text)
        
        # Detect anomalies in each metric
        anomalies = []
        affected_metrics = []
        
        for metric_name, values in metrics.items():
            if values and len(values) > 1:
                metric_anomalies = self._detect_metric_anomalies(metric_name, values)
                if metric_anomalies:
                    anomalies.extend(metric_anomalies)
                    affected_metrics.append(metric_name)
        
        # Calculate overall risk score
        risk_score = self._calculate_risk_score(anomalies, len(metrics))
        
        # Generate recommendations
        recommendations = self._generate_recommendations(anomalies, risk_score)
        
        return {
            "anomalies": anomalies,
            "risk_score": risk_score,
            "recommendations": recommendations,
            "affected_metrics": affected_metrics,
            "confidence": min(len(anomalies) / 5.0, 1.0)  # Higher confidence with more anomalies
        }
    
    def _extract_financial_metrics(self, text: str) -> Dict[str, List[float]]:
        """Extract financial metrics from text"""
        
        metrics = {
            "revenue": [],
            "profit": [],
            "earnings": [],
            "expenses": [],
            "cash_flow": [],
            "debt": [],
            "assets": [],
            "liabilities": []
        }
        
        # Extract numbers with context
        lines = text.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            
            # Revenue extraction
            if 'revenue' in line_lower or 'sales' in line_lower:
                value = self._extract_number(line)
                if value:
                    metrics["revenue"].append(value)
            
            # Profit extraction
            if any(word in line_lower for word in ['profit', 'earnings', 'net income']):
                value = self._extract_number(line)
                if value:
                    metrics["profit"].append(value)
            
            # Expenses extraction
            if 'expense' in line_lower or 'cost' in line_lower:
                value = self._extract_number(line)
                if value:
                    metrics["expenses"].append(value)
            
            # Cash flow extraction
            if 'cash flow' in line_lower:
                value = self._extract_number(line)
                if value:
                    metrics["cash_flow"].append(value)
            
            # Debt extraction
            if 'debt' in line_lower or 'liability' in line_lower:
                value = self._extract_number(line)
                if value:
                    metrics["debt"].append(value)
            
            # Assets extraction
            if 'asset' in line_lower:
                value = self._extract_number(line)
                if value:
                    metrics["assets"].append(value)
        
        return metrics
    
    def _extract_number(self, text: str) -> float:
        """Extract numeric values from text"""
        
        # Find numbers with currency symbols or commas
        number_pattern = r'[\$]?[\d,]+\.?\d*'
        matches = re.findall(number_pattern, text)
        
        if matches:
            # Clean up the first match
            number_str = matches[0].replace('$', '').replace(',', '')
            try:
                return float(number_str)
            except ValueError:
                return None
        
        return None
    
    def _detect_metric_anomalies(self, metric_name: str, values: List[float]) -> List[Dict[str, Any]]:
        """Detect anomalies in a specific metric"""
        
        anomalies = []
        
        if len(values) < 2:
            return anomalies
        
        # Calculate statistics
        mean_val = mean(values)
        std_val = stdev(values) if len(values) > 1 else 0
        
        # Z-score based anomaly detection
        for i, value in enumerate(values):
            if std_val > 0:
                z_score = abs((value - mean_val) / std_val)
                
                if z_score > self.z_score_threshold:
                    anomalies.append({
                        "metric": metric_name,
                        "value": value,
                        "expected_range": f"{mean_val - 2*std_val:.2f} - {mean_val + 2*std_val:.2f}",
                        "z_score": z_score,
                        "anomaly_type": "statistical_outlier",
                        "severity": "high" if z_score > 3 else "medium",
                        "description": f"{metric_name} value of {value} is {z_score:.2f} standard deviations from the mean"
                    })
        
        # Percentage change based anomaly detection
        for i in range(1, len(values)):
            if values[i-1] != 0:
                percentage_change = abs((values[i] - values[i-1]) / values[i-1])
                
                if percentage_change > self.percentage_change_threshold:
                    anomalies.append({
                        "metric": metric_name,
                        "value": values[i],
                        "previous_value": values[i-1],
                        "percentage_change": percentage_change * 100,
                        "anomaly_type": "significant_change",
                        "severity": "high" if percentage_change > 0.5 else "medium",
                        "description": f"{metric_name} changed by {percentage_change*100:.1f}% from {values[i-1]} to {values[i]}"
                    })
        
        return anomalies
    
    def _calculate_risk_score(self, anomalies: List[Dict[str, Any]], total_metrics: int) -> float:
        """Calculate overall risk score based on anomalies"""
        
        if not anomalies:
            return 0.0
        
        # Weight by severity
        severity_weights = {"low": 0.3, "medium": 0.6, "high": 1.0}
        
        total_weight = sum(severity_weights.get(anomaly.get("severity", "medium"), 0.6) for anomaly in anomalies)
        
        # Normalize by number of metrics and anomalies
        risk_score = min(total_weight / (total_metrics * 2), 1.0)
        
        return risk_score
    
    def _generate_recommendations(self, anomalies: List[Dict[str, Any]], risk_score: float) -> List[str]:
        """Generate recommendations based on detected anomalies"""
        
        recommendations = []
        
        if risk_score > 0.7:
            recommendations.append("High risk detected - Consider immediate review of financial statements")
            recommendations.append("Recommend consulting with financial advisors")
        elif risk_score > 0.4:
            recommendations.append("Medium risk detected - Monitor financial metrics closely")
            recommendations.append("Consider implementing additional controls")
        else:
            recommendations.append("Low risk profile - Continue regular monitoring")
        
        # Specific recommendations based on anomaly types
        statistical_outliers = [a for a in anomalies if a.get("anomaly_type") == "statistical_outlier"]
        significant_changes = [a for a in anomalies if a.get("anomaly_type") == "significant_change"]
        
        if statistical_outliers:
            recommendations.append(f"Investigate {len(statistical_outliers)} statistical outliers in financial data")
        
        if significant_changes:
            recommendations.append(f"Review {len(significant_changes)} significant changes in financial metrics")
        
        # Metric-specific recommendations
        affected_metrics = set(a.get("metric") for a in anomalies)
        
        if "revenue" in affected_metrics:
            recommendations.append("Review revenue recognition policies and sales processes")
        
        if "expenses" in affected_metrics:
            recommendations.append("Analyze expense patterns and cost control measures")
        
        if "cash_flow" in affected_metrics:
            recommendations.append("Monitor cash flow management and liquidity")
        
        return recommendations 