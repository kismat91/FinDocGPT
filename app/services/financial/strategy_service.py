import yfinance as yf
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from datetime import datetime, timedelta

class StrategyService:
    """Service for generating investment strategies and recommendations"""
    
    def __init__(self):
        self.technical_indicators = {}
        self.fundamental_metrics = {}
    
    async def generate_recommendation(
        self,
        symbol: str,
        investment_amount: float = None,
        risk_tolerance: str = "medium",
        time_horizon: str = "1y",
        include_technical_analysis: bool = True,
        include_fundamental_analysis: bool = True
    ) -> Dict[str, Any]:
        """Generate investment recommendation for a symbol"""
        
        try:
            # Get market data
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1y")
            
            if data.empty:
                return self._default_recommendation(symbol, "No data available")
            
            # Perform analysis
            technical_score = 0
            fundamental_score = 0
            technical_indicators = {}
            fundamental_metrics = {}
            
            if include_technical_analysis:
                technical_indicators = await self._analyze_technical_indicators(data)
                technical_score = self._calculate_technical_score(technical_indicators)
            
            if include_fundamental_analysis:
                fundamental_metrics = await self._analyze_fundamental_metrics(ticker)
                fundamental_score = self._calculate_fundamental_score(fundamental_metrics)
            
            # Combine scores
            if include_technical_analysis and include_fundamental_analysis:
                overall_score = (technical_score * 0.6) + (fundamental_score * 0.4)
            elif include_technical_analysis:
                overall_score = technical_score
            elif include_fundamental_analysis:
                overall_score = fundamental_score
            else:
                overall_score = 0
            
            # Generate recommendation
            recommendation = self._generate_recommendation_from_score(overall_score, risk_tolerance)
            
            # Calculate target price and stop loss
            current_price = data['Close'].iloc[-1]
            target_price = self._calculate_target_price(current_price, recommendation["action"], overall_score)
            stop_loss = self._calculate_stop_loss(current_price, risk_tolerance)
            
            # Generate reasoning
            reasoning = self._generate_reasoning(
                recommendation["action"],
                technical_indicators,
                fundamental_metrics,
                overall_score
            )
            
            return {
                "action": recommendation["action"],
                "confidence": recommendation["confidence"],
                "reasoning": reasoning,
                "risk_level": self._determine_risk_level(overall_score, risk_tolerance),
                "target_price": target_price,
                "stop_loss": stop_loss,
                "factors": {
                    "technical_indicators": technical_indicators,
                    "fundamental_metrics": fundamental_metrics,
                    "overall_score": overall_score
                },
                "factors_considered": self._get_factors_considered(
                    technical_indicators, fundamental_metrics, include_technical_analysis, include_fundamental_analysis
                )
            }
            
        except Exception as e:
            return self._default_recommendation(symbol, f"Error: {str(e)}")
    
    async def _analyze_technical_indicators(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze technical indicators"""
        
        indicators = {}
        
        # Moving averages
        data['MA20'] = data['Close'].rolling(window=20).mean()
        data['MA50'] = data['Close'].rolling(window=50).mean()
        data['MA200'] = data['Close'].rolling(window=200).mean()
        
        current_price = data['Close'].iloc[-1]
        
        # Price vs moving averages
        indicators['price_vs_ma20'] = "above" if current_price > data['MA20'].iloc[-1] else "below"
        indicators['price_vs_ma50'] = "above" if current_price > data['MA50'].iloc[-1] else "below"
        indicators['price_vs_ma200'] = "above" if current_price > data['MA200'].iloc[-1] else "below"
        
        # RSI calculation
        delta = data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        indicators['rsi'] = rsi.iloc[-1]
        
        # MACD calculation
        exp1 = data['Close'].ewm(span=12).mean()
        exp2 = data['Close'].ewm(span=26).mean()
        macd = exp1 - exp2
        signal = macd.ewm(span=9).mean()
        indicators['macd'] = macd.iloc[-1]
        indicators['macd_signal'] = signal.iloc[-1]
        
        # Volume analysis
        avg_volume = data['Volume'].rolling(window=20).mean()
        current_volume = data['Volume'].iloc[-1]
        indicators['volume_trend'] = "high" if current_volume > avg_volume.iloc[-1] * 1.5 else "normal"
        
        # Volatility
        returns = data['Close'].pct_change()
        indicators['volatility'] = returns.std() * np.sqrt(252)  # Annualized volatility
        
        return indicators
    
    async def _analyze_fundamental_metrics(self, ticker: yf.Ticker) -> Dict[str, Any]:
        """Analyze fundamental metrics"""
        
        metrics = {}
        
        try:
            # Get company info
            info = ticker.info
            
            # P/E Ratio
            if 'trailingPE' in info and info['trailingPE'] is not None:
                metrics['pe_ratio'] = info['trailingPE']
            else:
                metrics['pe_ratio'] = None
            
            # P/B Ratio
            if 'priceToBook' in info and info['priceToBook'] is not None:
                metrics['pb_ratio'] = info['priceToBook']
            else:
                metrics['pb_ratio'] = None
            
            # Dividend Yield
            if 'dividendYield' in info and info['dividendYield'] is not None:
                metrics['dividend_yield'] = info['dividendYield'] * 100
            else:
                metrics['dividend_yield'] = 0
            
            # Market Cap
            if 'marketCap' in info and info['marketCap'] is not None:
                metrics['market_cap'] = info['marketCap']
            else:
                metrics['market_cap'] = None
            
            # Beta
            if 'beta' in info and info['beta'] is not None:
                metrics['beta'] = info['beta']
            else:
                metrics['beta'] = 1.0
            
            # Sector
            metrics['sector'] = info.get('sector', 'Unknown')
            
        except Exception as e:
            print(f"Error getting fundamental data: {e}")
            metrics = {
                'pe_ratio': None,
                'pb_ratio': None,
                'dividend_yield': 0,
                'market_cap': None,
                'beta': 1.0,
                'sector': 'Unknown'
            }
        
        return metrics
    
    def _calculate_technical_score(self, indicators: Dict[str, Any]) -> float:
        """Calculate technical analysis score"""
        
        score = 0.0
        factors = 0
        
        # Price vs moving averages (weight: 0.3)
        ma_score = 0
        if indicators.get('price_vs_ma20') == "above":
            ma_score += 0.33
        if indicators.get('price_vs_ma50') == "above":
            ma_score += 0.33
        if indicators.get('price_vs_ma200') == "above":
            ma_score += 0.34
        score += ma_score * 0.3
        factors += 1
        
        # RSI (weight: 0.2)
        rsi = indicators.get('rsi', 50)
        if 30 <= rsi <= 70:
            score += 0.2  # Neutral RSI
        elif rsi < 30:
            score += 0.3  # Oversold (bullish)
        else:
            score += 0.1  # Overbought (bearish)
        factors += 1
        
        # MACD (weight: 0.2)
        macd = indicators.get('macd', 0)
        macd_signal = indicators.get('macd_signal', 0)
        if macd > macd_signal:
            score += 0.2  # Bullish MACD
        else:
            score += 0.0  # Bearish MACD
        factors += 1
        
        # Volume (weight: 0.15)
        if indicators.get('volume_trend') == "high":
            score += 0.15
        else:
            score += 0.075
        factors += 1
        
        # Volatility (weight: 0.15)
        volatility = indicators.get('volatility', 0.2)
        if volatility < 0.3:  # Low volatility is generally good
            score += 0.15
        elif volatility < 0.5:
            score += 0.1
        else:
            score += 0.05
        factors += 1
        
        return score if factors > 0 else 0.5
    
    def _calculate_fundamental_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate fundamental analysis score"""
        
        score = 0.0
        factors = 0
        
        # P/E Ratio (weight: 0.3)
        pe_ratio = metrics.get('pe_ratio')
        if pe_ratio is not None:
            if pe_ratio < 15:
                score += 0.3  # Undervalued
            elif pe_ratio < 25:
                score += 0.2  # Fair value
            else:
                score += 0.1  # Overvalued
            factors += 1
        
        # P/B Ratio (weight: 0.2)
        pb_ratio = metrics.get('pb_ratio')
        if pb_ratio is not None:
            if pb_ratio < 1.5:
                score += 0.2  # Undervalued
            elif pb_ratio < 3:
                score += 0.15  # Fair value
            else:
                score += 0.1  # Overvalued
            factors += 1
        
        # Dividend Yield (weight: 0.2)
        dividend_yield = metrics.get('dividend_yield', 0)
        if dividend_yield > 3:
            score += 0.2  # High dividend
        elif dividend_yield > 1:
            score += 0.15  # Moderate dividend
        else:
            score += 0.1  # Low dividend
        factors += 1
        
        # Beta (weight: 0.15)
        beta = metrics.get('beta', 1.0)
        if beta < 0.8:
            score += 0.15  # Low volatility
        elif beta < 1.2:
            score += 0.1  # Moderate volatility
        else:
            score += 0.05  # High volatility
        factors += 1
        
        # Market Cap (weight: 0.15)
        market_cap = metrics.get('market_cap')
        if market_cap is not None:
            if market_cap > 10e9:  # Large cap
                score += 0.15
            elif market_cap > 2e9:  # Mid cap
                score += 0.1
            else:
                score += 0.05  # Small cap
            factors += 1
        
        return score if factors > 0 else 0.5
    
    def _generate_recommendation_from_score(self, score: float, risk_tolerance: str) -> Dict[str, Any]:
        """Generate recommendation based on score and risk tolerance"""
        
        # Adjust thresholds based on risk tolerance
        if risk_tolerance == "low":
            buy_threshold = 0.7
            sell_threshold = 0.3
        elif risk_tolerance == "high":
            buy_threshold = 0.6
            sell_threshold = 0.4
        else:  # medium
            buy_threshold = 0.65
            sell_threshold = 0.35
        
        if score >= buy_threshold:
            action = "buy"
            confidence = min((score - buy_threshold) / (1 - buy_threshold), 1.0)
        elif score <= sell_threshold:
            action = "sell"
            confidence = min((sell_threshold - score) / sell_threshold, 1.0)
        else:
            action = "hold"
            confidence = 0.5
        
        return {
            "action": action,
            "confidence": confidence
        }
    
    def _calculate_target_price(self, current_price: float, action: str, score: float) -> float:
        """Calculate target price based on action and score"""
        
        if action == "buy":
            # Target 10-20% upside
            target_percentage = 0.15 + (score * 0.1)
            return current_price * (1 + target_percentage)
        elif action == "sell":
            # Target 10-20% downside
            target_percentage = 0.15 + ((1 - score) * 0.1)
            return current_price * (1 - target_percentage)
        else:
            # Hold - no target price
            return current_price
    
    def _calculate_stop_loss(self, current_price: float, risk_tolerance: str) -> float:
        """Calculate stop loss based on risk tolerance"""
        
        if risk_tolerance == "low":
            stop_loss_percentage = 0.05  # 5%
        elif risk_tolerance == "high":
            stop_loss_percentage = 0.15  # 15%
        else:  # medium
            stop_loss_percentage = 0.10  # 10%
        
        return current_price * (1 - stop_loss_percentage)
    
    def _determine_risk_level(self, score: float, risk_tolerance: str) -> str:
        """Determine risk level based on score and tolerance"""
        
        if risk_tolerance == "low" or score < 0.3:
            return "low"
        elif risk_tolerance == "high" or score > 0.7:
            return "high"
        else:
            return "medium"
    
    def _generate_reasoning(
        self, 
        action: str, 
        technical_indicators: Dict[str, Any], 
        fundamental_metrics: Dict[str, Any],
        overall_score: float
    ) -> str:
        """Generate reasoning for the recommendation"""
        
        reasoning_parts = []
        
        if action == "buy":
            reasoning_parts.append("Positive investment opportunity identified.")
        elif action == "sell":
            reasoning_parts.append("Consider reducing position or taking profits.")
        else:
            reasoning_parts.append("Neutral position recommended.")
        
        # Add technical analysis reasoning
        if technical_indicators:
            ma_status = []
            if technical_indicators.get('price_vs_ma20') == "above":
                ma_status.append("above 20-day MA")
            if technical_indicators.get('price_vs_ma50') == "above":
                ma_status.append("above 50-day MA")
            
            if ma_status:
                reasoning_parts.append(f"Price is {' and '.join(ma_status)}.")
            
            rsi = technical_indicators.get('rsi', 50)
            if rsi < 30:
                reasoning_parts.append("RSI indicates oversold conditions.")
            elif rsi > 70:
                reasoning_parts.append("RSI indicates overbought conditions.")
        
        # Add fundamental analysis reasoning
        if fundamental_metrics:
            pe_ratio = fundamental_metrics.get('pe_ratio')
            if pe_ratio and pe_ratio < 15:
                reasoning_parts.append("P/E ratio suggests undervaluation.")
            elif pe_ratio and pe_ratio > 25:
                reasoning_parts.append("P/E ratio suggests overvaluation.")
            
            dividend_yield = fundamental_metrics.get('dividend_yield', 0)
            if dividend_yield > 3:
                reasoning_parts.append("Attractive dividend yield.")
        
        reasoning_parts.append(f"Overall confidence score: {overall_score:.2f}")
        
        return " ".join(reasoning_parts)
    
    def _get_factors_considered(
        self, 
        technical_indicators: Dict[str, Any], 
        fundamental_metrics: Dict[str, Any],
        include_technical: bool,
        include_fundamental: bool
    ) -> List[str]:
        """Get list of factors considered in analysis"""
        
        factors = []
        
        if include_technical:
            factors.extend([
                "Moving Averages",
                "RSI (Relative Strength Index)",
                "MACD",
                "Volume Analysis",
                "Volatility"
            ])
        
        if include_fundamental:
            factors.extend([
                "P/E Ratio",
                "P/B Ratio",
                "Dividend Yield",
                "Beta",
                "Market Capitalization"
            ])
        
        return factors
    
    def _default_recommendation(self, symbol: str, reason: str) -> Dict[str, Any]:
        """Return default recommendation when analysis fails"""
        return {
            "action": "hold",
            "confidence": 0.3,
            "reasoning": f"Insufficient data for {symbol}. {reason}",
            "risk_level": "medium",
            "target_price": None,
            "stop_loss": None,
            "factors": {},
            "factors_considered": []
        } 