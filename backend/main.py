from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    
    # Check if this is a PHQ-9 score submission
    if 'score' in data:
        score = int(data.get('score', 0))
        
        # Simple response logic for PHQ-9 scores
        if score <= 4:
            message = "Your mental health appears to be in good shape!"
        elif score <= 14:
            message = "You are doing well. You can talk to me about anything you are dealing with or anything that is on your mind."
        else:
            message = "You may be experiencing significant depression. Please consider seeking professional help."
        
        return jsonify({
            'status': 'success',
            'score': score,
            'message': message
        })
    
    # Handle regular chat messages
    elif 'query' in data:
        user_query = data.get('query', '').lower()
        
        # Simple response logic for chat queries
        if any(word in user_query for word in ['hello', 'hi', 'hey']):
            response = "Hello! How can I help you today?"
        elif any(word in user_query for word in ['how are you', "how're you"]):
            response = "I'm here to support you. How can I assist you today?"
        elif any(word in user_query for word in ['thank', 'thanks']):
            response = "You're welcome! Is there anything else you'd like to talk about?"
        elif any(word in user_query for word in ['help', 'support']):
            response = "I'm here to listen and provide support. You can share what's on your mind, and I'll do my best to help."
        else:
            response = "I'm here to listen. Could you tell me more about how you're feeling?"
        
        return jsonify({
            'status': 'success',
            'response': response,
            'timestamp': data.get('timestamp', '')
        })
    
    # If no valid parameters are provided
    return jsonify({
        'status': 'error',
        'message': 'No valid parameters provided. Please include either a score or query parameter.'
    }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)