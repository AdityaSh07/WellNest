import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


# --- 1. INITIALIZE THE APPLICATION AND MODELS ---


# Load environment variables (for GOOGLE_API_KEY)
load_dotenv()


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing


# --- GLOBAL VARIABLES FOR LANGCHAIN COMPONENTS ---
# We initialize these once to avoid reloading on every request.
vec_store = None
rag_chain = None


class RunnableDictTransform(Runnable):
    def invoke(self, x):
        return {
            "context": x["context"],
            "question": x["question"],
            "score": x["score"]
        }


def initialize_rag_chain():
    """
    Initializes the RAG chain components. This function is called once
    when the Flask application starts.
    """
    global vec_store, rag_chain

    # Initialize models
    model = ChatGoogleGenerativeAI(model='gemini-1.5-flash', temperature=0.3)
    embed_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

    # Define the path for the persistent vector database
    persist_directory = 'chroma_db'

    # Load or Create the Vector Store
    if not os.path.exists(persist_directory):
        print("Creating new vector store...")
        if not os.path.exists('report.txt'):
            raise FileNotFoundError("The 'report.txt' file is missing. Please create it with your knowledge base content.")

        loader = TextLoader("report.txt")
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=50)
        chunks = text_splitter.split_documents(documents)

        vec_store = Chroma.from_documents(
            documents=chunks,
            embedding=embed_model,
            persist_directory=persist_directory,
            collection_name='embeddings'
        )
        print("Vector store created and saved.")
    else:
        print("Loading existing vector store.")
        vec_store = Chroma(
            persist_directory=persist_directory,
            embedding_function=embed_model,
            collection_name='embeddings'
        )

    # Create Retriever and Prompt Template
    retriever = vec_store.as_retriever(search_kwargs={'k': 4})

    prompt_template = PromptTemplate(
        template='''
        You are a compassionate and helpful assistant for a mental health support chatbot.
        Your primary role is to answer the user's questions based exclusively on the provided context.
        The user has completed a PHQ-9 questionnaire and their score is provided below. Use this score to provide a more empathetic and relevant response.
        Do not use any external knowledge. If the context does not contain the answer, state that you cannot find the information in the provided documents.

        CONTEXT:
        {context}

        USER'S PHQ-9 SCORE: {score}

        QUESTION:
        {question}

        ANSWER:
        ''',
        input_variables=['context', 'question', 'score']
    )

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # Build the RAG chain with RunnableDictTransform replacing the lambda function
    rag_chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
            "score": RunnablePassthrough()
        }
        | RunnableDictTransform()
        | prompt_template
        | model
        | StrOutputParser()
    )
    print("RAG chain initialized successfully.")


# --- 2. DEFINE FLASK ROUTES ---


@app.route('/chat', methods=['POST'])
def get_advice():
    """
    Handles POST requests to get advice from the chatbot.
    """
    if not rag_chain:
        return jsonify({"error": "RAG chain not initialized"}), 500

    try:
        data = request.get_json()
        question = data.get('question')
        score = data.get('score')

        if not question or score is None:
            return jsonify({"error": "Missing 'question' or 'score' in request"}), 400

        # Prepare input for the RAG chain
        chain_input = {"question": question, "score": score}

        # Invoke the RAG chain
        response = rag_chain.invoke(chain_input)

        return jsonify({"answer": response})

    except Exception as e:
        print(f"Error during RAG chain invocation: {e}")
        return jsonify({"error": "Failed to process the request"}), 500


# --- 3. RUN THE APPLICATION ---


if __name__ == '__main__':
    # Initialize the RAG chain on startup
    initialize_rag_chain()
    # Run the Flask app
    app.run(debug=True, port=5000)
