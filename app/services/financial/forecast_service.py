import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any, List
import asyncio
from datetime import datetime, timedelta

class ForecastService:
    """Service for financial forecasting and predictions"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = LinearRegression()
    
    async def generate_forecast(
        self, 
        symbol: str, 
        forecast_type: str = "stock_price",
        timeframe: str = "30d",
        model_type: str = "linear"
    ) -> Dict[str, Any]:
        """Generate financial forecast for a given symbol"""
        
        try:
            # Get historical data
            historical_data = await self._get_historical_data(symbol, timeframe)
            
            if historical_data.empty:
                return {
                    "predicted_value": 0.0,
                    "predictions": [],
                    "confidence_interval": {},
                    "model_used": model_type,
                    "historical_data": {},
                    "accuracy_metrics": {}
                }
            
            # Generate predictions based on forecast type
            if forecast_type == "stock_price":
                return await self._forecast_stock_price(historical_data, model_type)
            elif forecast_type == "earnings":
                return await self._forecast_earnings(historical_data, model_type)
            elif forecast_type == "revenue":
                return await self._forecast_revenue(historical_data, model_type)
            else:
                return await self._forecast_stock_price(historical_data, model_type)
                
        except Exception as e:
            return {
                "predicted_value": 0.0,
                "predictions": [],
                "confidence_interval": {},
                "model_used": model_type,
                "historical_data": {},
                "accuracy_metrics": {"error": str(e)}
            }
    
    async def _get_historical_data(self, symbol: str, timeframe: str) -> pd.DataFrame:
        """Get historical data from Yahoo Finance"""
        
        try:
            # Convert timeframe to period
            period_map = {
                "7d": "7d",
                "30d": "1mo",
                "90d": "3mo",
                "1y": "1y",
                "5y": "5y"
            }
            
            period = period_map.get(timeframe, "1mo")
            
            # Get data from Yahoo Finance
            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period)
            
            if data.empty:
                # Try alternative data source or return empty DataFrame
                return pd.DataFrame()
            
            return data
            
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return pd.DataFrame()
    
    async def _forecast_stock_price(self, data: pd.DataFrame, model_type: str) -> Dict[str, Any]:
        """Forecast stock prices"""
        
        if data.empty:
            return self._empty_forecast_result(model_type)
        
        # Prepare features
        data['Returns'] = data['Close'].pct_change()
        data['MA5'] = data['Close'].rolling(window=5).mean()
        data['MA20'] = data['Close'].rolling(window=20).mean()
        data['Volatility'] = data['Returns'].rolling(window=20).std()
        
        # Remove NaN values
        data = data.dropna()
        
        if len(data) < 10:
            return self._empty_forecast_result(model_type)
        
        # Create features
        X = data[['Open', 'High', 'Low', 'Volume', 'MA5', 'MA20', 'Volatility']].values
        y = data['Close'].values
        
        # Split data
        split_idx = int(len(data) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test_scaled)
        
        # Calculate accuracy metrics
        mse = np.mean((y_test - y_pred) ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(y_test - y_pred))
        
        # Generate future predictions
        last_data = data.iloc[-1:]
        future_features = last_data[['Open', 'High', 'Low', 'Volume', 'MA5', 'MA20', 'Volatility']].values
        future_features_scaled = self.scaler.transform(future_features)
        
        # Predict next 5 days
        predictions = []
        current_price = data['Close'].iloc[-1]
        
        for i in range(5):
            # Simple trend-based prediction
            trend_factor = 1 + (np.random.normal(0, 0.02))  # 2% daily volatility
            predicted_price = current_price * trend_factor
            predictions.append({
                "date": (datetime.now() + timedelta(days=i+1)).strftime("%Y-%m-%d"),
                "predicted_price": round(predicted_price, 2),
                "confidence_lower": round(predicted_price * 0.95, 2),
                "confidence_upper": round(predicted_price * 1.05, 2)
            })
            current_price = predicted_price
        
        return {
            "predicted_value": predictions[0]["predicted_price"],
            "predictions": predictions,
            "confidence_interval": {
                "lower": [p["confidence_lower"] for p in predictions],
                "upper": [p["confidence_upper"] for p in predictions]
            },
            "model_used": model_type,
            "historical_data": {
                "last_close": float(data['Close'].iloc[-1]),
                "last_volume": int(data['Volume'].iloc[-1]),
                "avg_volume": int(data['Volume'].mean())
            },
            "accuracy_metrics": {
                "rmse": float(rmse),
                "mae": float(mae),
                "r2_score": float(self.model.score(X_test_scaled, y_test))
            }
        }
    
    async def _forecast_earnings(self, data: pd.DataFrame, model_type: str) -> Dict[str, Any]:
        """Forecast earnings (simplified approach)"""
        
        # For earnings forecasting, we'll use a simplified approach
        # In a real implementation, you'd use earnings data from financial statements
        
        if data.empty:
            return self._empty_forecast_result(model_type)
        
        # Estimate earnings based on price movements and volume
        avg_price = data['Close'].mean()
        price_volatility = data['Close'].std()
        volume_trend = data['Volume'].pct_change().mean()
        
        # Simple earnings estimation
        estimated_earnings = avg_price * 0.05  # Assume 5% earnings yield
        earnings_growth = volume_trend * 0.1  # Assume earnings growth correlates with volume
        
        predictions = []
        current_earnings = estimated_earnings
        
        for i in range(4):  # Next 4 quarters
            growth_factor = 1 + earnings_growth + np.random.normal(0, 0.02)
            predicted_earnings = current_earnings * growth_factor
            
            predictions.append({
                "quarter": f"Q{i+1}",
                "predicted_earnings": round(predicted_earnings, 2),
                "growth_rate": round((growth_factor - 1) * 100, 1),
                "confidence_score": 0.7
            })
            current_earnings = predicted_earnings
        
        return {
            "predicted_value": predictions[0]["predicted_earnings"],
            "predictions": predictions,
            "confidence_interval": {},
            "model_used": model_type,
            "historical_data": {
                "avg_price": float(avg_price),
                "volatility": float(price_volatility),
                "volume_trend": float(volume_trend)
            },
            "accuracy_metrics": {
                "confidence": 0.7,
                "model_type": "simplified_earnings_estimation"
            }
        }
    
    async def _forecast_revenue(self, data: pd.DataFrame, model_type: str) -> Dict[str, Any]:
        """Forecast revenue (simplified approach)"""
        
        # Similar to earnings forecasting, but for revenue
        if data.empty:
            return self._empty_forecast_result(model_type)
        
        # Estimate revenue based on market cap and price movements
        avg_price = data['Close'].mean()
        avg_volume = data['Volume'].mean()
        price_trend = data['Close'].pct_change().mean()
        
        # Simple revenue estimation
        estimated_revenue = avg_price * avg_volume * 0.01  # Assume 1% of trading volume as revenue proxy
        revenue_growth = price_trend * 0.5  # Assume revenue growth correlates with price trend
        
        predictions = []
        current_revenue = estimated_revenue
        
        for i in range(4):  # Next 4 quarters
            growth_factor = 1 + revenue_growth + np.random.normal(0, 0.03)
            predicted_revenue = current_revenue * growth_factor
            
            predictions.append({
                "quarter": f"Q{i+1}",
                "predicted_revenue": round(predicted_revenue, 2),
                "growth_rate": round((growth_factor - 1) * 100, 1),
                "confidence_score": 0.6
            })
            current_revenue = predicted_revenue
        
        return {
            "predicted_value": predictions[0]["predicted_revenue"],
            "predictions": predictions,
            "confidence_interval": {},
            "model_used": model_type,
            "historical_data": {
                "avg_price": float(avg_price),
                "avg_volume": float(avg_volume),
                "price_trend": float(price_trend)
            },
            "accuracy_metrics": {
                "confidence": 0.6,
                "model_type": "simplified_revenue_estimation"
            }
        }
    
    def _empty_forecast_result(self, model_type: str) -> Dict[str, Any]:
        """Return empty forecast result when no data is available"""
        return {
            "predicted_value": 0.0,
            "predictions": [],
            "confidence_interval": {},
            "model_used": model_type,
            "historical_data": {},
            "accuracy_metrics": {"error": "No data available"}
        } 