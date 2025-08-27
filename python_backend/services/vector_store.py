import os
import json
import hashlib
from typing import Dict, Any, List, Optional
from fastapi import UploadFile
import chromadb
from chromadb.config import Settings
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import pickle
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class VectorStore:
    """
    Vector store service for RAG (Retrieval Augmented Generation) capabilities
    """
    
    def __init__(self):
        self.chroma_client = None
        self.faiss_index = None
        self.embedding_model = None
        self.documents = {}
        self._initialize_services()
    
    def _initialize_services(self):
        """Initialize vector store services"""
        try:
            # Initialize ChromaDB
            self.chroma_client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory="./chroma_db"
            ))
            
            # Initialize FAISS index
            self._initialize_faiss()
            
            # Initialize embedding model
            self._initialize_embedding_model()
            
            # Create or get collections
            self._setup_collections()
            
        except Exception as e:
            print(f"Vector store initialization warning: {e}")
    
    def _initialize_faiss(self):
        """Initialize FAISS index for similarity search"""
        try:
            # Create a simple FAISS index for 384-dimensional vectors
            dimension = 384  # Default dimension for sentence-transformers
            self.faiss_index = faiss.IndexFlatL2(dimension)
            
            # Create a mapping to store document metadata
            self.faiss_documents = []
            
        except Exception as e:
            print(f"FAISS initialization warning: {e}")
    
    def _initialize_embedding_model(self):
        """Initialize sentence embedding model"""
        try:
            # Use a lightweight model for embeddings
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Embedding model initialization warning: {e}")
    
    def _setup_collections(self):
        """Setup ChromaDB collections"""
        try:
            # Create collections for different document types
            self.collections = {
                'financial_documents': self.chroma_client.create_collection(
                    name="financial_documents",
                    metadata={"description": "Financial reports and documents"}
                ),
                'compliance_documents': self.chroma_client.create_collection(
                    name="compliance_documents",
                    metadata={"description": "Compliance and regulatory documents"}
                ),
                'risk_documents': self.chroma_client.create_collection(
                    name="risk_documents",
                    metadata={"description": "Risk assessment documents"}
                ),
                'general_documents': self.chroma_client.create_collection(
                    name="general_documents",
                    metadata={"description": "General financial documents"}
                )
            }
        except Exception as e:
            print(f"Collection setup warning: {e}")
    
    async def store_document(
        self,
        file: UploadFile,
        document_type: str = "general",
        metadata: Dict[str, Any] = None
    ) -> str:
        """
        Store document in vector database
        """
        try:
            # Generate document ID
            doc_id = self._generate_document_id(file)
            
            # Extract content from file
            content = await self._extract_file_content(file)
            
            # Split content into chunks
            chunks = self._split_content_into_chunks(content)
            
            # Generate embeddings for chunks
            embeddings = self._generate_embeddings(chunks)
            
            # Store in ChromaDB
            await self._store_in_chromadb(
                doc_id, chunks, embeddings, document_type, metadata
            )
            
            # Store in FAISS
            await self._store_in_faiss(doc_id, embeddings, metadata)
            
            # Store document metadata
            self.documents[doc_id] = {
                'filename': file.filename,
                'document_type': document_type,
                'content_length': len(content),
                'chunks_count': len(chunks),
                'metadata': metadata or {},
                'timestamp': self._get_timestamp()
            }
            
            return doc_id
            
        except Exception as e:
            raise Exception(f"Document storage failed: {str(e)}")
    
    async def retrieve_documents(
        self,
        query: str,
        document_type: str = None,
        top_k: int = 5,
        similarity_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents based on query
        """
        try:
            # Generate query embedding
            query_embedding = self._generate_embeddings([query])[0]
            
            # Search in FAISS
            faiss_results = self._search_faiss(query_embedding, top_k)
            
            # Search in ChromaDB
            chroma_results = await self._search_chromadb(
                query, document_type, top_k
            )
            
            # Combine and rank results
            combined_results = self._combine_search_results(
                faiss_results, chroma_results, query_embedding
            )
            
            # Filter by similarity threshold
            filtered_results = [
                result for result in combined_results
                if result['similarity_score'] >= similarity_threshold
            ]
            
            return filtered_results[:top_k]
            
        except Exception as e:
            raise Exception(f"Document retrieval failed: {str(e)}")
    
    async def update_document(
        self,
        doc_id: str,
        new_content: str,
        metadata: Dict[str, Any] = None
    ) -> bool:
        """
        Update existing document
        """
        try:
            if doc_id not in self.documents:
                raise Exception(f"Document {doc_id} not found")
            
            # Split new content into chunks
            chunks = self._split_content_into_chunks(new_content)
            
            # Generate new embeddings
            embeddings = self._generate_embeddings(chunks)
            
            # Update ChromaDB
            await self._update_chromadb(doc_id, chunks, embeddings, metadata)
            
            # Update FAISS
            await self._update_faiss(doc_id, embeddings)
            
            # Update metadata
            self.documents[doc_id].update({
                'content_length': len(new_content),
                'chunks_count': len(chunks),
                'metadata': metadata or self.documents[doc_id].get('metadata', {}),
                'last_updated': self._get_timestamp()
            })
            
            return True
            
        except Exception as e:
            raise Exception(f"Document update failed: {str(e)}")
    
    async def delete_document(self, doc_id: str) -> bool:
        """
        Delete document from vector database
        """
        try:
            if doc_id not in self.documents:
                raise Exception(f"Document {doc_id} not found")
            
            # Remove from ChromaDB
            await self._delete_from_chromadb(doc_id)
            
            # Remove from FAISS
            await self._delete_from_faiss(doc_id)
            
            # Remove from documents
            del self.documents[doc_id]
            
            return True
            
        except Exception as e:
            raise Exception(f"Document deletion failed: {str(e)}")
    
    def get_document_info(self, doc_id: str) -> Dict[str, Any]:
        """Get document information"""
        return self.documents.get(doc_id, {})
    
    def list_documents(self, document_type: str = None) -> List[Dict[str, Any]]:
        """List all documents or filter by type"""
        if document_type:
            return [
                {'id': doc_id, **info}
                for doc_id, info in self.documents.items()
                if info.get('document_type') == document_type
            ]
        else:
            return [
                {'id': doc_id, **info}
                for doc_id, info in self.documents.items()
            ]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get vector store statistics"""
        return {
            'total_documents': len(self.documents),
            'document_types': self._count_document_types(),
            'total_chunks': sum(doc.get('chunks_count', 0) for doc in self.documents.values()),
            'storage_size': self._calculate_storage_size(),
            'collections': list(self.collections.keys()) if self.collections else []
        }
    
    def _generate_document_id(self, file: UploadFile) -> str:
        """Generate unique document ID"""
        content = f"{file.filename}_{self._get_timestamp()}"
        return hashlib.md5(content.encode()).hexdigest()
    
    async def _extract_file_content(self, file: UploadFile) -> str:
        """Extract text content from uploaded file"""
        try:
            content = await file.read()
            
            if hasattr(content, 'decode'):
                return content.decode('utf-8')
            else:
                return str(content)
                
        except Exception as e:
            raise Exception(f"File content extraction failed: {str(e)}")
    
    def _split_content_into_chunks(
        self,
        content: str,
        chunk_size: int = 1000,
        overlap: int = 200
    ) -> List[str]:
        """Split content into overlapping chunks"""
        chunks = []
        start = 0
        
        while start < len(content):
            end = start + chunk_size
            chunk = content[start:end]
            
            if chunk.strip():
                chunks.append(chunk.strip())
            
            start = end - overlap
            
            if start >= len(content):
                break
        
        return chunks
    
    def _generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for text chunks"""
        try:
            if self.embedding_model is None:
                # Fallback to simple TF-IDF like approach
                return self._generate_simple_embeddings(texts)
            
            embeddings = self.embedding_model.encode(texts)
            return embeddings.tolist()
            
        except Exception as e:
            print(f"Embedding generation warning: {e}")
            return self._generate_simple_embeddings(texts)
    
    def _generate_simple_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate simple embeddings as fallback"""
        embeddings = []
        for text in texts:
            # Simple hash-based embedding
            embedding = [0.0] * 384  # 384 dimensions
            for i, char in enumerate(text[:384]):
                embedding[i] = ord(char) / 255.0
            embeddings.append(embedding)
        return embeddings
    
    async def _store_in_chromadb(
        self,
        doc_id: str,
        chunks: List[str],
        embeddings: List[List[float]],
        document_type: str,
        metadata: Dict[str, Any]
    ):
        """Store document in ChromaDB"""
        try:
            collection = self.collections.get(document_type, self.collections['general_documents'])
            
            # Prepare data for ChromaDB
            ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
            metadatas = [
                {
                    'document_id': doc_id,
                    'chunk_index': i,
                    'document_type': document_type,
                    **metadata
                }
                for i in range(len(chunks))
            ]
            
            # Add to collection
            collection.add(
                embeddings=embeddings,
                documents=chunks,
                metadatas=metadatas,
                ids=ids
            )
            
        except Exception as e:
            print(f"ChromaDB storage warning: {e}")
    
    async def _store_in_faiss(
        self,
        doc_id: str,
        embeddings: List[List[float]],
        metadata: Dict[str, Any]
    ):
        """Store document in FAISS"""
        try:
            if self.faiss_index is None:
                return
            
            # Convert embeddings to numpy array
            embeddings_array = np.array(embeddings, dtype=np.float32)
            
            # Add to FAISS index
            self.faiss_index.add(embeddings_array)
            
            # Store document metadata
            for i, embedding in enumerate(embeddings):
                self.faiss_documents.append({
                    'document_id': doc_id,
                    'chunk_index': i,
                    'metadata': metadata
                })
                
        except Exception as e:
            print(f"FAISS storage warning: {e}")
    
    async def _search_chromadb(
        self,
        query: str,
        document_type: str = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Search documents in ChromaDB"""
        try:
            results = []
            
            if document_type and document_type in self.collections:
                collection = self.collections[document_type]
                search_results = collection.query(
                    query_texts=[query],
                    n_results=top_k
                )
                
                for i in range(len(search_results['documents'][0])):
                    results.append({
                        'source': 'chromadb',
                        'document_id': search_results['metadatas'][0][i]['document_id'],
                        'chunk_index': search_results['metadatas'][0][i]['chunk_index'],
                        'content': search_results['documents'][0][i],
                        'metadata': search_results['metadatas'][0][i],
                        'similarity_score': 0.8  # Placeholder
                    })
            else:
                # Search in all collections
                for collection_name, collection in self.collections.items():
                    search_results = collection.query(
                        query_texts=[query],
                        n_results=top_k // len(self.collections)
                    )
                    
                    for i in range(len(search_results['documents'][0])):
                        results.append({
                            'source': 'chromadb',
                            'document_id': search_results['metadatas'][0][i]['document_id'],
                            'chunk_index': search_results['metadatas'][0][i]['chunk_index'],
                            'content': search_results['documents'][0][i],
                            'metadata': search_results['metadatas'][0][i],
                            'similarity_score': 0.8  # Placeholder
                        })
            
            return results
            
        except Exception as e:
            print(f"ChromaDB search warning: {e}")
            return []
    
    def _search_faiss(
        self,
        query_embedding: List[float],
        top_k: int
    ) -> List[Dict[str, Any]]:
        """Search documents in FAISS"""
        try:
            if self.faiss_index is None or len(self.faiss_documents) == 0:
                return []
            
            # Convert query embedding to numpy array
            query_array = np.array([query_embedding], dtype=np.float32)
            
            # Search in FAISS
            distances, indices = self.faiss_index.search(query_array, top_k)
            
            results = []
            for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
                if idx < len(self.faiss_documents):
                    doc_info = self.faiss_documents[idx]
                    results.append({
                        'source': 'faiss',
                        'document_id': doc_info['document_id'],
                        'chunk_index': doc_info['chunk_index'],
                        'metadata': doc_info['metadata'],
                        'similarity_score': 1.0 / (1.0 + distance),  # Convert distance to similarity
                        'distance': float(distance)
                    })
            
            return results
            
        except Exception as e:
            print(f"FAISS search warning: {e}")
            return []
    
    def _combine_search_results(
        self,
        faiss_results: List[Dict[str, Any]],
        chroma_results: List[Dict[str, Any]],
        query_embedding: List[float]
    ) -> List[Dict[str, Any]]:
        """Combine and rank search results from different sources"""
        all_results = []
        
        # Add FAISS results
        for result in faiss_results:
            all_results.append({
                **result,
                'source_rank': 1
            })
        
        # Add ChromaDB results
        for result in chroma_results:
            all_results.append({
                **result,
                'source_rank': 2
            })
        
        # Remove duplicates based on document_id and chunk_index
        seen = set()
        unique_results = []
        for result in all_results:
            key = (result['document_id'], result['chunk_index'])
            if key not in seen:
                seen.add(key)
                unique_results.append(result)
        
        # Sort by similarity score
        unique_results.sort(key=lambda x: x.get('similarity_score', 0), reverse=True)
        
        return unique_results
    
    async def _update_chromadb(
        self,
        doc_id: str,
        chunks: List[str],
        embeddings: List[List[float]],
        metadata: Dict[str, Any]
    ):
        """Update document in ChromaDB"""
        try:
            # Delete old chunks
            await self._delete_from_chromadb(doc_id)
            
            # Store new chunks
            await self._store_in_chromadb(doc_id, chunks, embeddings, 'general', metadata)
            
        except Exception as e:
            print(f"ChromaDB update warning: {e}")
    
    async def _update_faiss(
        self,
        doc_id: str,
        embeddings: List[List[float]]
    ):
        """Update document in FAISS"""
        try:
            # Remove old chunks
            await self._delete_from_faiss(doc_id)
            
            # Store new chunks
            await self._store_in_faiss(doc_id, embeddings, {})
            
        except Exception as e:
            print(f"FAISS update warning: {e}")
    
    async def _delete_from_chromadb(self, doc_id: str):
        """Delete document from ChromaDB"""
        try:
            for collection in self.collections.values():
                # Get all chunks for this document
                results = collection.get(
                    where={'document_id': doc_id}
                )
                
                if results['ids']:
                    collection.delete(ids=results['ids'])
                    
        except Exception as e:
            print(f"ChromaDB deletion warning: {e}")
    
    async def _delete_from_faiss(self, doc_id: str):
        """Delete document from FAISS"""
        try:
            # Remove from documents list
            self.faiss_documents = [
                doc for doc in self.faiss_documents
                if doc['document_id'] != doc_id
            ]
            
            # Note: FAISS doesn't support deletion, so we'd need to rebuild the index
            # For now, we'll just track the documents
            
        except Exception as e:
            print(f"FAISS deletion warning: {e}")
    
    def _count_document_types(self) -> Dict[str, int]:
        """Count documents by type"""
        type_counts = {}
        for doc_info in self.documents.values():
            doc_type = doc_info.get('document_type', 'unknown')
            type_counts[doc_type] = type_counts.get(doc_type, 0) + 1
        return type_counts
    
    def _calculate_storage_size(self) -> str:
        """Calculate approximate storage size"""
        total_size = 0
        for doc_info in self.documents.values():
            total_size += doc_info.get('content_length', 0)
        
        if total_size < 1024:
            return f"{total_size} B"
        elif total_size < 1024 * 1024:
            return f"{total_size / 1024:.1f} KB"
        else:
            return f"{total_size / (1024 * 1024):.1f} MB"
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
