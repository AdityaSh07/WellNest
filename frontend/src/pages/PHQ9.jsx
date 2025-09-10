import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading the newspaper or watching television?",
  "Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?"
];

const options = [
  { text: "Not at all", value: 0 },
  { text: "Several days", value: 1 },
  { text: "More than half the days", value: 2 },
  { text: "Nearly every day", value: 3 }
];

export default function PHQ9() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      // After showing results, automatically send the score to the chatbot
      const score = newAnswers.reduce((sum, answer) => sum + (answer || 0), 0);
      // Store the score in localStorage to be used when navigating to chatbot
      localStorage.setItem('phq9Score', score);
    }
  };

  const calculateScore = () => {
    return answers.reduce((sum, answer) => sum + (answer || 0), 0);
  };

  const getResultMessage = (score) => {
    if (score <= 4) {
      return {
        message: "Your mental health appears to be in good shape!",
        severity: "low",
        suggestion: "Continue practicing good self-care and check in with yourself regularly."
      };
    } else if (score <= 14) {
      return {
        message: "You're experiencing some difficulties with your mental health.",
        severity: "moderate",
        suggestion: "Consider talking to our AI chatbot for support and guidance."
      };
    } else {
      return {
        message: "You may be experiencing significant depression.",
        severity: "high",
        suggestion: "We strongly recommend speaking with a mental health professional. Would you like help finding a counselor?"
      };
    }
  };

  const score = calculateScore();
  const result = getResultMessage(score);;

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your PHQ-9 Results</h2>
          
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {score}
              </span>
              <p className="text-gray-600 mt-2">Total Score (out of 27)</p>
            </div>

            <div className={`p-6 rounded-xl mb-6 ${
              result.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
              result.severity === 'moderate' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              'bg-green-50 border-l-4 border-green-500'
            }`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.message}</h3>
              <p className="text-gray-700">{result.suggestion}</p>
            </div>

            <div className="mt-8 space-y-4">
              {result.severity === 'high' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-700 transition-colors"
                  onClick={() => navigate('/counselor')}
                >
                  Find a Counselor
                </motion.button>
              )}
              
              {result.severity === 'moderate' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg font-medium shadow hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    const score = localStorage.getItem('phq9Score');
                    navigate('/chatbot', { state: { phq9Score: score } });
                  }}
                >
                  Talk to Our AI Chatbot
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => window.location.reload()}
              >
                Retake Assessment
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestion) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {questions[currentQuestion]}
          </h2>

          <div className="space-y-4">
            {options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                  answers[currentQuestion] === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${
                    answers[currentQuestion] === option.value
                      ? 'border-purple-600 bg-purple-600'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            Previous
          </motion.button>
          
          <span className="text-sm text-gray-500 self-center">
            {answers.filter(a => a !== null).length} of {questions.length} answered
          </span>
        </div>
      </motion.div>
    </div>
  );
}
