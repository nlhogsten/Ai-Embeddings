# Ai-Embeddings
AI Embeddings Test Project
This project explores AI embeddings using OpenAI’s ```text-embedding-3-large``` model and stores them in a PostgreSQL database with ```pgvector```.

<h2>What are AI Embeddings?</h2>

AI embeddings are numerical representations of text that capture meaning and relationships between words. They allow machines to understand and compare text efficiently, making them useful for search, recommendations, and classification.

Model: ```text-embedding-3-large```

This is a powerful embedding model from OpenAI that converts text into high-dimensional vectors. It improves upon previous versions with better efficiency and accuracy in capturing semantic meaning.

Vector Databases & ```pgvector``` for ```PostgreSQL```

A vector database stores embeddings so that similar text can be quickly retrieved using mathematical similarity (e.g., cosine similarity). ```pgvector``` is an extension for PostgreSQL that enables vector search, allowing AI-powered queries directly within a relational database.
