import re
from typing import Dict, Any, List
import openai
from app.core.config import settings

class DocumentQA:
    """Service for answering questions about financial documents"""
    
    def __init__(self):
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
    
    async def ask_question(self, document_content: str, question: str) -> Dict[str, Any]:
        """Answer a question about a financial document"""
        
        if not document_content:
            return {
                "answer": "No document content available to answer the question.",
                "confidence": 0.0,
                "sources": [],
                "reasoning": "Document content is empty or unavailable."
            }
        
        # Try OpenAI if available
        if settings.OPENAI_API_KEY:
            return await self._ask_openai(document_content, question)
        else:
            return await self._ask_rule_based(document_content, question)
    
    async def _ask_openai(self, document_content: str, question: str) -> Dict[str, Any]:
        """Use OpenAI to answer questions"""
        try:
            prompt = f"""
            You are a financial analyst assistant. Answer the following question based on the financial document content provided.
            
            Document Content:
            {document_content[:4000]}  # Limit content length
            
            Question: {question}
            
            Please provide a clear, accurate answer based on the document content. If the information is not available in the document, say so.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial analyst assistant. Provide accurate, helpful answers based on the document content."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            answer = response.choices[0].message.content.strip()
            
            return {
                "answer": answer,
                "confidence": 0.85,  # High confidence for OpenAI
                "sources": ["Document content analysis"],
                "reasoning": "Answer generated using AI analysis of document content."
            }
            
        except Exception as e:
            # Fallback to rule-based approach
            return await self._ask_rule_based(document_content, question)
    
    async def _ask_rule_based(self, document_content: str, question: str) -> Dict[str, Any]:
        """Use rule-based approach to answer questions"""
        
        question_lower = question.lower()
        content_lower = document_content.lower()
        
        # Revenue questions
        if any(word in question_lower for word in ['revenue', 'sales', 'income']):
            return self._extract_revenue_info(document_content, content_lower)
        
        # Profit questions
        elif any(word in question_lower for word in ['profit', 'earnings', 'net income']):
            return self._extract_profit_info(document_content, content_lower)
        
        # Risk questions
        elif any(word in question_lower for word in ['risk', 'risks', 'challenge', 'challenges']):
            return self._extract_risk_info(document_content, content_lower)
        
        # Growth questions
        elif any(word in question_lower for word in ['growth', 'increase', 'decrease', 'change']):
            return self._extract_growth_info(document_content, content_lower)
        
        # Default response
        else:
            return {
                "answer": "I can help you find information about revenue, profit, risks, and growth in this document. Please ask a specific question about these topics.",
                "confidence": 0.5,
                "sources": ["Document content"],
                "reasoning": "Question type not specifically handled by rule-based system."
            }
    
    def _extract_revenue_info(self, content: str, content_lower: str) -> Dict[str, Any]:
        """Extract revenue information"""
        revenue_patterns = [
            r'revenue[:\s]*\$?([\d,]+\.?\d*)',
            r'sales[:\s]*\$?([\d,]+\.?\d*)',
            r'income[:\s]*\$?([\d,]+\.?\d*)'
        ]
        
        for pattern in revenue_patterns:
            matches = re.findall(pattern, content_lower)
            if matches:
                revenue_value = matches[0].replace(',', '')
                return {
                    "answer": f"The revenue is ${revenue_value}.",
                    "confidence": 0.7,
                    "sources": ["Revenue data extraction"],
                    "reasoning": "Revenue value found using pattern matching."
                }
        
        return {
            "answer": "Revenue information is not clearly stated in this document.",
            "confidence": 0.3,
            "sources": ["Document content"],
            "reasoning": "No clear revenue figures found in document."
        }
    
    def _extract_profit_info(self, content: str, content_lower: str) -> Dict[str, Any]:
        """Extract profit information"""
        profit_patterns = [
            r'profit[:\s]*\$?([\d,]+\.?\d*)',
            r'earnings[:\s]*\$?([\d,]+\.?\d*)',
            r'net income[:\s]*\$?([\d,]+\.?\d*)'
        ]
        
        for pattern in profit_patterns:
            matches = re.findall(pattern, content_lower)
            if matches:
                profit_value = matches[0].replace(',', '')
                return {
                    "answer": f"The profit/earnings is ${profit_value}.",
                    "confidence": 0.7,
                    "sources": ["Profit data extraction"],
                    "reasoning": "Profit value found using pattern matching."
                }
        
        return {
            "answer": "Profit/earnings information is not clearly stated in this document.",
            "confidence": 0.3,
            "sources": ["Document content"],
            "reasoning": "No clear profit figures found in document."
        }
    
    def _extract_risk_info(self, content: str, content_lower: str) -> Dict[str, Any]:
        """Extract risk information"""
        risk_keywords = ['risk', 'challenge', 'uncertainty', 'volatility', 'exposure']
        risk_sentences = []
        
        sentences = content.split('.')
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in risk_keywords):
                risk_sentences.append(sentence.strip())
        
        if risk_sentences:
            return {
                "answer": f"Key risks identified: {' '.join(risk_sentences[:3])}",
                "confidence": 0.6,
                "sources": ["Risk analysis"],
                "reasoning": "Risk-related sentences found in document."
            }
        
        return {
            "answer": "No specific risks are clearly identified in this document.",
            "confidence": 0.4,
            "sources": ["Document content"],
            "reasoning": "No risk-related content found in document."
        }
    
    def _extract_growth_info(self, content: str, content_lower: str) -> Dict[str, Any]:
        """Extract growth information"""
        growth_keywords = ['growth', 'increase', 'decrease', 'change', 'growth rate']
        growth_sentences = []
        
        sentences = content.split('.')
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in growth_keywords):
                growth_sentences.append(sentence.strip())
        
        if growth_sentences:
            return {
                "answer": f"Growth information: {' '.join(growth_sentences[:3])}",
                "confidence": 0.6,
                "sources": ["Growth analysis"],
                "reasoning": "Growth-related sentences found in document."
            }
        
        return {
            "answer": "No specific growth information is clearly stated in this document.",
            "confidence": 0.4,
            "sources": ["Document content"],
            "reasoning": "No growth-related content found in document."
        } 