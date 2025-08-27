import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from fastapi import UploadFile
import openai
import anthropic
import groq
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AIAnalyzer:
    """
    Advanced AI analyzer with multiple LLM providers and RAG capabilities
    """
    
    def __init__(self):
        self.llm_providers = {}
        self._initialize_llm_providers()
        self.analysis_templates = self._load_analysis_templates()
    
    def _initialize_llm_providers(self):
        """Initialize different LLM providers"""
        try:
            # OpenAI
            if os.getenv('OPENAI_API_KEY'):
                openai.api_key = os.getenv('OPENAI_API_KEY')
                self.llm_providers['openai'] = openai
            
            # Anthropic
            if os.getenv('ANTHROPIC_API_KEY'):
                self.llm_providers['anthropic'] = anthropic.Anthropic(
                    api_key=os.getenv('ANTHROPIC_API_KEY')
                )
            
            # Groq
            if os.getenv('GROQ_API_KEY'):
                self.llm_providers['groq'] = groq.Groq(
                    api_key=os.getenv('GROQ_API_KEY')
                )
            
            # Mistral
            if os.getenv('MISTRAL_API_KEY'):
                self.llm_providers['mistral'] = {
                    'api_key': os.getenv('MISTRAL_API_KEY'),
                    'base_url': 'https://api.mistral.ai/v1'
                }
            
            # Hugging Face
            if os.getenv('HUGGINGFACE_API_KEY'):
                self.llm_providers['huggingface'] = {
                    'api_key': os.getenv('HUGGINGFACE_API_KEY'),
                    'base_url': 'https://api-inference.huggingface.co'
                }
                
        except Exception as e:
            print(f"LLM provider initialization warning: {e}")
    
    def _load_analysis_templates(self) -> Dict[str, str]:
        """Load analysis prompt templates"""
        return {
            'financial_analysis': """
            Analyze the following financial document and provide a comprehensive analysis:
            
            Document Content: {content}
            
            Please provide analysis in the following JSON format:
            {{
                "document_type": "string",
                "financial_metrics": {{
                    "revenue": "string or number",
                    "profit": "string or number",
                    "growth_rate": "string or number",
                    "debt_ratio": "string or number",
                    "cash_flow": "string or number"
                }},
                "key_insights": ["array of insights"],
                "risk_assessment": {{
                    "risk_level": "low/medium/high",
                    "risk_factors": ["array of risk factors"],
                    "risk_score": "number 1-10"
                }},
                "recommendations": ["array of recommendations"],
                "confidence_score": "number 0-1"
            }}
            """,
            
            'compliance_analysis': """
            Analyze the following document for compliance with financial regulations:
            
            Document Content: {content}
            
            Please provide analysis in the following JSON format:
            {{
                "compliance_status": "compliant/non-compliant/partial",
                "compliance_score": "number 0-10",
                "regulations_checked": ["array of regulations"],
                "violations_found": ["array of violations"],
                "compliance_gaps": ["array of gaps"],
                "recommendations": ["array of recommendations"],
                "confidence_score": "number 0-1"
            }}
            """,
            
            'risk_analysis': """
            Perform a comprehensive risk assessment of the following financial document:
            
            Document Content: {content}
            
            Please provide analysis in the following JSON format:
            {{
                "overall_risk_score": "number 1-10",
                "risk_level": "low/medium/high/critical",
                "risk_categories": {{
                    "market_risk": "number 1-10",
                    "credit_risk": "number 1-10",
                    "operational_risk": "number 1-10",
                    "liquidity_risk": "number 1-10"
                }},
                "risk_factors": ["array of risk factors"],
                "mitigation_strategies": ["array of strategies"],
                "risk_trends": "increasing/decreasing/stable",
                "confidence_score": "number 0-1"
            }}
            """,
            
            'forecasting_analysis': """
            Generate financial forecasts based on the following document:
            
            Document Content: {content}
            
            Please provide analysis in the following JSON format:
            {{
                "forecast_period": "string",
                "revenue_forecast": "string or percentage",
                "profit_forecast": "string or percentage",
                "growth_projections": {{
                    "short_term": "string",
                    "medium_term": "string",
                    "long_term": "string"
                }},
                "key_assumptions": ["array of assumptions"],
                "risk_factors": ["array of risk factors"],
                "confidence_intervals": {{
                    "optimistic": "string",
                    "realistic": "string",
                    "pessimistic": "string"
                }},
                "confidence_score": "number 0-1"
            }}
            """
        }
    
    async def rag_analysis(
        self,
        file: UploadFile,
        query: str = "",
        vector_db_id: str = None,
        llm_provider: str = "auto"
    ) -> Dict[str, Any]:
        """
        RAG (Retrieval Augmented Generation) analysis
        """
        try:
            # Extract content from file
            content = await self._extract_file_content(file)
            
            # If no specific query, generate one based on content
            if not query:
                query = self._generate_default_query(content)
            
            # Perform RAG analysis
            if vector_db_id:
                # Use vector database for retrieval
                retrieved_context = await self._retrieve_from_vector_db(vector_db_id, query)
                enhanced_content = f"{content}\n\nRetrieved Context: {retrieved_context}"
            else:
                enhanced_content = content
            
            # Analyze with AI
            analysis_result = await self._analyze_with_ai(
                enhanced_content,
                query,
                llm_provider
            )
            
            return {
                'analysis_type': 'rag',
                'query': query,
                'vector_db_id': vector_db_id,
                'content_length': len(content),
                'enhanced_content_length': len(enhanced_content),
                'analysis_result': analysis_result,
                'rag_components': {
                    'retrieval': vector_db_id is not None,
                    'generation': True,
                    'context_enhancement': True
                }
            }
            
        except Exception as e:
            raise Exception(f"RAG analysis failed: {str(e)}")
    
    async def comprehensive_financial_analysis(
        self,
        file: UploadFile,
        analysis_types: List[str] = None,
        llm_provider: str = "auto"
    ) -> Dict[str, Any]:
        """
        Comprehensive financial analysis using multiple AI models
        """
        if analysis_types is None:
            analysis_types = ['financial', 'compliance', 'risk', 'forecasting']
        
        try:
            # Extract content from file
            content = await self._extract_file_content(file)
            
            # Perform analysis for each type
            results = {}
            for analysis_type in analysis_types:
                if analysis_type in self.analysis_templates:
                    template = self.analysis_templates[analysis_type]
                    prompt = template.format(content=content[:5000])  # Limit content length
                    
                    result = await self._analyze_with_ai(
                        content,
                        prompt,
                        llm_provider,
                        analysis_type
                    )
                    results[analysis_type] = result
            
            # Generate comprehensive summary
            summary = await self._generate_comprehensive_summary(results, llm_provider)
            
            return {
                'analysis_types': analysis_types,
                'individual_analyses': results,
                'comprehensive_summary': summary,
                'total_analyses': len(results),
                'status': 'completed'
            }
            
        except Exception as e:
            raise Exception(f"Comprehensive analysis failed: {str(e)}")
    
    async def _analyze_with_ai(
        self,
        content: str,
        prompt: str,
        llm_provider: str = "auto",
        analysis_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Analyze content with AI using specified or auto-selected provider
        """
        try:
            # Auto-select provider if not specified
            if llm_provider == "auto":
                llm_provider = self._select_best_provider(analysis_type)
            
            if llm_provider not in self.llm_providers:
                raise Exception(f"LLM provider {llm_provider} not available")
            
            # Prepare the prompt
            full_prompt = f"{prompt}\n\nContent to analyze:\n{content[:4000]}"
            
            # Call the appropriate LLM provider
            if llm_provider == "openai":
                response = await self._call_openai(full_prompt)
            elif llm_provider == "anthropic":
                response = await self._call_anthropic(full_prompt)
            elif llm_provider == "groq":
                response = await self._call_groq(full_prompt)
            else:
                raise Exception(f"Unsupported LLM provider: {llm_provider}")
            
            # Parse the response
            parsed_response = self._parse_ai_response(response, analysis_type)
            
            return {
                'provider': llm_provider,
                'analysis_type': analysis_type,
                'raw_response': response,
                'parsed_response': parsed_response,
                'success': True
            }
            
        except Exception as e:
            return {
                'provider': llm_provider,
                'analysis_type': analysis_type,
                'error': str(e),
                'success': False
            }
    
    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a financial analysis expert. Provide detailed, accurate analysis in the requested format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.2
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API call failed: {str(e)}")
    
    async def _call_anthropic(self, prompt: str) -> str:
        """Call Anthropic API"""
        try:
            response = self.llm_providers['anthropic'].messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=2000,
                temperature=0.2,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text
        except Exception as e:
            raise Exception(f"Anthropic API call failed: {str(e)}")
    
    async def _call_groq(self, prompt: str) -> str:
        """Call Groq API"""
        try:
            response = self.llm_providers['groq'].chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": "You are a financial analysis expert. Provide detailed, accurate analysis in the requested format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.2
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Groq API call failed: {str(e)}")
    
    def _select_best_provider(self, analysis_type: str) -> str:
        """Select the best LLM provider for the analysis type"""
        available_providers = list(self.llm_providers.keys())
        
        if not available_providers:
            raise Exception("No LLM providers available")
        
        # Simple provider selection logic
        if analysis_type == "financial" and "openai" in available_providers:
            return "openai"
        elif analysis_type == "compliance" and "anthropic" in available_providers:
            return "anthropic"
        elif analysis_type == "risk" and "groq" in available_providers:
            return "groq"
        else:
            # Return first available provider
            return available_providers[0]
    
    def _parse_ai_response(self, response: str, analysis_type: str) -> Dict[str, Any]:
        """Parse AI response and extract structured data"""
        try:
            # Try to extract JSON from response
            if '{' in response and '}' in response:
                start = response.find('{')
                end = response.rfind('}') + 1
                json_str = response[start:end]
                
                try:
                    parsed = json.loads(json_str)
                    return {
                        'structured_data': parsed,
                        'parsing_success': True,
                        'format': 'json'
                    }
                except json.JSONDecodeError:
                    pass
            
            # If JSON parsing fails, return raw response
            return {
                'structured_data': response,
                'parsing_success': False,
                'format': 'text'
            }
            
        except Exception as e:
            return {
                'structured_data': response,
                'parsing_success': False,
                'format': 'text',
                'parsing_error': str(e)
            }
    
    async def _extract_file_content(self, file: UploadFile) -> str:
        """Extract text content from uploaded file"""
        try:
            content = await file.read()
            
            # For now, return as string
            # In production, this would handle different file types
            if hasattr(content, 'decode'):
                return content.decode('utf-8')
            else:
                return str(content)
                
        except Exception as e:
            raise Exception(f"File content extraction failed: {str(e)}")
    
    def _generate_default_query(self, content: str) -> str:
        """Generate a default query based on content"""
        # Simple query generation based on content keywords
        keywords = ['financial', 'report', 'earnings', 'revenue', 'profit', 'risk', 'compliance']
        
        for keyword in keywords:
            if keyword.lower() in content.lower():
                return f"Analyze this {keyword} document and provide key insights"
        
        return "Analyze this document and provide comprehensive financial insights"
    
    async def _retrieve_from_vector_db(self, vector_db_id: str, query: str) -> str:
        """Retrieve relevant context from vector database"""
        # Placeholder for vector database retrieval
        # In production, this would use ChromaDB, FAISS, or similar
        return f"Retrieved context for query: {query} from document {vector_db_id}"
    
    async def _generate_comprehensive_summary(
        self,
        results: Dict[str, Any],
        llm_provider: str
    ) -> Dict[str, Any]:
        """Generate comprehensive summary of all analyses"""
        try:
            # Create summary prompt
            summary_prompt = f"""
            Based on the following financial analyses, provide a comprehensive summary:
            
            {json.dumps(results, indent=2)}
            
            Please provide a summary in JSON format with:
            - Overall assessment
            - Key findings
            - Critical insights
            - Actionable recommendations
            - Risk summary
            """
            
            # Generate summary using AI
            summary_response = await self._analyze_with_ai(
                summary_prompt,
                summary_prompt,
                llm_provider,
                "summary"
            )
            
            return {
                'summary_type': 'comprehensive',
                'generated_by': llm_provider,
                'content': summary_response.get('parsed_response', {}),
                'status': 'completed'
            }
            
        except Exception as e:
            return {
                'summary_type': 'comprehensive',
                'error': str(e),
                'status': 'failed'
            }
    
    def get_available_providers(self) -> List[str]:
        """Get list of available LLM providers"""
        return list(self.llm_providers.keys())
    
    def get_analysis_templates(self) -> List[str]:
        """Get list of available analysis templates"""
        return list(self.analysis_templates.keys())
