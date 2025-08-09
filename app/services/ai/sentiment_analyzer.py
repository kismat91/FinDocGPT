from textblob import TextBlob
import re
from typing import Dict, Any, List

class SentimentAnalyzer:
    """Service for analyzing sentiment in financial documents"""
    
    def __init__(self):
        # Financial-specific sentiment keywords
        self.positive_financial_words = [
            'growth', 'increase', 'profit', 'revenue', 'positive', 'strong', 'improve',
            'gain', 'rise', 'up', 'higher', 'better', 'success', 'excellent', 'outperform',
            'beat', 'exceed', 'surge', 'jump', 'climb', 'soar', 'rally', 'bullish'
        ]
        
        self.negative_financial_words = [
            'loss', 'decline', 'decrease', 'drop', 'fall', 'negative', 'weak', 'worse',
            'risk', 'volatility', 'uncertainty', 'concern', 'challenge', 'pressure',
            'downturn', 'recession', 'bearish', 'crash', 'plunge', 'tumble', 'slump'
        ]
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of financial text"""
        
        if not text:
            return {
                "score": 0.0,
                "label": "neutral",
                "confidence": 0.0,
                "keywords": []
            }
        
        # Use TextBlob for basic sentiment analysis
        blob = TextBlob(text)
        textblob_score = blob.sentiment.polarity
        
        # Custom financial sentiment analysis
        financial_score = self._analyze_financial_sentiment(text)
        
        # Combine scores (weight financial analysis more heavily)
        combined_score = (textblob_score * 0.3) + (financial_score * 0.7)
        
        # Determine label
        if combined_score > 0.1:
            label = "positive"
        elif combined_score < -0.1:
            label = "negative"
        else:
            label = "neutral"
        
        # Calculate confidence based on text length and score magnitude
        confidence = min(abs(combined_score) * 2, 1.0)
        
        # Extract keywords
        keywords = self._extract_keywords(text)
        
        return {
            "score": combined_score,
            "label": label,
            "confidence": confidence,
            "keywords": keywords
        }
    
    def _analyze_financial_sentiment(self, text: str) -> float:
        """Analyze sentiment using financial-specific keywords"""
        
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        
        positive_count = 0
        negative_count = 0
        
        for word in words:
            if word in self.positive_financial_words:
                positive_count += 1
            elif word in self.negative_financial_words:
                negative_count += 1
        
        total_financial_words = positive_count + negative_count
        
        if total_financial_words == 0:
            return 0.0
        
        # Calculate sentiment score (-1 to 1)
        sentiment_score = (positive_count - negative_count) / total_financial_words
        
        return sentiment_score
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important financial keywords from text"""
        
        # Financial keywords to look for
        financial_keywords = [
            'revenue', 'profit', 'earnings', 'growth', 'sales', 'income',
            'expenses', 'costs', 'margin', 'cash flow', 'debt', 'assets',
            'liabilities', 'equity', 'market', 'stock', 'shares', 'dividend',
            'investment', 'portfolio', 'trading', 'volatility', 'risk',
            'return', 'performance', 'quarter', 'annual', 'fiscal'
        ]
        
        text_lower = text.lower()
        found_keywords = []
        
        for keyword in financial_keywords:
            if keyword in text_lower:
                found_keywords.append(keyword)
        
        return found_keywords[:10]  # Limit to top 10 keywords
    
    async def analyze_market_sentiment(self, documents: List[str]) -> Dict[str, Any]:
        """Analyze overall market sentiment from multiple documents"""
        
        if not documents:
            return {
                "overall_sentiment": "neutral",
                "sentiment_score": 0.0,
                "confidence": 0.0,
                "key_phrases": [],
                "sentiment_trend": "stable",
                "risk_factors": [],
                "positive_factors": [],
                "negative_factors": []
            }
        
        # Analyze each document
        sentiment_scores = []
        all_keywords = []
        positive_factors = []
        negative_factors = []
        
        for i, document in enumerate(documents):
            sentiment_result = await self.analyze_sentiment(document)
            sentiment_scores.append(sentiment_result["score"])
            all_keywords.extend(sentiment_result.get("keywords", []))
            
            # Categorize factors
            if sentiment_result["score"] > 0.1:
                positive_factors.append(f"Document {i+1}: Positive sentiment")
            elif sentiment_result["score"] < -0.1:
                negative_factors.append(f"Document {i+1}: Negative sentiment")
        
        # Calculate overall sentiment
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
        
        # Determine overall sentiment
        if avg_sentiment > 0.2:
            overall_sentiment = "positive"
            sentiment_trend = "improving"
        elif avg_sentiment < -0.2:
            overall_sentiment = "negative"
            sentiment_trend = "declining"
        else:
            overall_sentiment = "neutral"
            sentiment_trend = "stable"
        
        # Calculate confidence
        confidence = min(len(documents) / 10.0, 1.0)
        
        return {
            "overall_sentiment": overall_sentiment,
            "sentiment_score": avg_sentiment,
            "confidence": confidence,
            "key_phrases": list(set(all_keywords)),
            "sentiment_trend": sentiment_trend,
            "risk_factors": negative_factors,
            "positive_factors": positive_factors,
            "negative_factors": negative_factors
        } 