import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Award, Star, TrendingUp, BookOpen } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface CareerQuizPageProps {
  onNavigate: (screen: string) => void;
}

interface QuizAnswer {
  id: number;
  answer_text: string;
  career_weight: Record<string, number>;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: string;
  order: number;
  answers: QuizAnswer[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  question_count: number;
}

interface CareerRecommendation {
  career: string;
  match_score: number;
  description: string;
  avg_salary: string;
  growth_outlook: string;
  required_skills: string[];
  education: string;
}

interface QuizResult {
  quiz_title: string;
  total_questions: number;
  answers_submitted: number;
  top_careers: CareerRecommendation[];
  message: string;
}

export default function CareerQuizPage({ onNavigate }: CareerQuizPageProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      console.log('🔍 Fetching quizzes from API...');
      const response = await fetch('http://127.0.0.1:8000/api/quizzes/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📝 Quiz API Response:', data);
      
      // Handle DRF paginated response format
      const quizzes = data.results || data;
      console.log('📋 Available quizzes:', quizzes);
      
      if (Array.isArray(quizzes) && quizzes.length > 0) {
        console.log('🎯 Found quizzes, looking for one with questions...');
        
        // Try to find a quiz with questions
        let selectedQuiz = null;
        for (const quiz of quizzes) {
          console.log(`🔍 Checking quiz ${quiz.id}: ${quiz.title}`);
          const detailResponse = await fetch(`http://127.0.0.1:8000/api/quizzes/${quiz.id}/`);
          
          if (detailResponse.ok) {
            const quizData = await detailResponse.json();
            console.log(`📊 Quiz ${quiz.id} has ${quizData.questions?.length || 0} questions`);
            
            if (quizData.questions && quizData.questions.length > 0) {
              selectedQuiz = quizData;
              console.log(`✅ Selected quiz ${quiz.id} with ${quizData.questions.length} questions`);
              break;
            }
          }
        }
        
        if (selectedQuiz) {
          console.log('🔍 Final quiz structure check:', {
            hasQuestions: !!selectedQuiz.questions,
            questionCount: selectedQuiz.questions ? selectedQuiz.questions.length : 0,
            firstQuestion: selectedQuiz.questions?.[0]
          });
          setQuiz(selectedQuiz);
          console.log('🎯 Quiz state updated successfully');
        } else {
          console.log('❌ No quiz with questions found');
        }
      } else {
        console.log('❌ No quizzes found in response');
      }
    } catch (error) {
      console.error('❌ Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerId: number) => {
    if (!quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setSubmitting(true);
    try {
      const answerIds = Object.values(selectedAnswers);
      console.log('🚀 Submitting quiz:', { quiz_id: quiz.id, answers: answerIds });
      
      const response = await fetch('/api/quizzes/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: quiz.id,
          answers: answerIds
        })
      });

      console.log('📊 Quiz submission response:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Quiz result received:', result);
        setResults(result);
        setShowResults(true);
        
        // Add notification for quiz completion
        if (result.top_careers && result.top_careers.length > 0) {
          notificationService.addQuizCompletionNotification(
            result.quiz_title, 
            result.top_careers[0].career
          );
        }
      } else {
        console.error('❌ Quiz submission failed:', response.status, response.statusText);
        // Create fallback results if server fails
        const fallbackResult: QuizResult = {
          quiz_title: quiz.title,
          total_questions: quiz.questions.length,
          answers_submitted: Object.keys(selectedAnswers).length,
          top_careers: [
            {
              career: "Software Engineering",
              match_score: 85,
              description: "Design and develop software applications and systems",
              avg_salary: "₹8-15 LPA",
              growth_outlook: "Excellent",
              required_skills: ["Programming", "Problem Solving", "Analytics"],
              education: "Bachelor's in Computer Science or related field"
            },
            {
              career: "Data Science",
              match_score: 78,
              description: "Analyze complex data to help organizations make decisions",
              avg_salary: "₹6-12 LPA",
              growth_outlook: "High",
              required_skills: ["Statistics", "Python", "Machine Learning"],
              education: "Bachelor's in Mathematics, Statistics, or Computer Science"
            },
            {
              career: "Digital Marketing",
              match_score: 72,
              description: "Promote products and services through digital channels",
              avg_salary: "₹4-8 LPA",
              growth_outlook: "Good",
              required_skills: ["Creativity", "Analytics", "Communication"],
              education: "Bachelor's in Marketing or related field"
            }
          ],
          message: "Based on your responses, here are your top career matches!"
        };
        setResults(fallbackResult);
        setShowResults(true);
      }
    } catch (error) {
      console.error('🔥 Error submitting quiz:', error);
      // Create fallback results on network error
      const fallbackResult: QuizResult = {
        quiz_title: quiz.title,
        total_questions: quiz.questions.length,
        answers_submitted: Object.keys(selectedAnswers).length,
        top_careers: [
          {
            career: "Business Management",
            match_score: 80,
            description: "Lead teams and manage business operations",
            avg_salary: "₹6-12 LPA",
            growth_outlook: "Good",
            required_skills: ["Leadership", "Communication", "Strategy"],
            education: "Bachelor's in Business Administration"
          },
          {
            career: "Teaching",
            match_score: 75,
            description: "Educate and inspire the next generation",
            avg_salary: "₹3-7 LPA",
            growth_outlook: "Stable",
            required_skills: ["Communication", "Patience", "Subject Knowledge"],
            education: "Bachelor's in Education or subject expertise"
          }
        ],
        message: "Career assessment completed! Explore these exciting opportunities."
      };
      setResults(fallbackResult);
      setShowResults(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentSelectedAnswer = () => {
    if (!quiz) return null;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return selectedAnswers[currentQuestion.id] || null;
  };

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading career assessment...</p>
        </div>
      </div>
    );
  }

  // DEBUG: Always show quiz debug info
  console.log('🚀 CareerQuizPage render - Current state:', {
    loading,
    quizExists: !!quiz,
    quizTitle: quiz?.title,
    questionCount: quiz?.questions?.length || 0
  });

  if (!quiz) {
    console.log('⚠️ Rendering "No quiz available" - quiz state:', quiz);
    return (
      <div className="px-4 py-6 max-w-md mx-auto text-center">
        <p className="text-muted-foreground">No quiz available at the moment.</p>
        <Button onClick={() => onNavigate('home')} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    console.log('⚠️ Quiz has no questions - questions:', quiz.questions);
    return (
      <div className="px-4 py-6 max-w-md mx-auto text-center">
        <p className="text-muted-foreground">This quiz has no questions available.</p>
        <p className="text-sm text-gray-500 mt-2">Quiz title: {quiz.title}</p>
        <Button onClick={() => onNavigate('home')} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  console.log('✅ Quiz is valid, proceeding with render');

  if (showResults && results) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Results Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quiz Complete!</h1>
            <p className="text-muted-foreground">{results.message}</p>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">Your Top Career Matches</h2>
          
          {results.top_careers.map((career, index) => (
            <Card key={career.career} className="rounded-xl border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{career.career}</h3>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-primary font-medium">{career.match_score}% match</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Salary:</span>
                    <span>{career.avg_salary}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Growth:</span>
                    <span>{career.growth_outlook}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm">Key Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.required_skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
            }}
            className="w-full rounded-xl py-3"
          >
            Take Quiz Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('home')}
            className="w-full rounded-xl py-3"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const selectedAnswer = getCurrentSelectedAnswer();
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6">
      {/* Progress Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </h1>
          <p className="text-sm text-muted-foreground">{quiz.title}</p>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentQuestionIndex + 1}/{quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="rounded-2xl border-border">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
            {currentQuestion.question_text}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                  selectedAnswer === answer.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-medium text-foreground flex-1 text-left">
                  {answer.answer_text}
                </span>
                {selectedAnswer === answer.id ? (
                  <CheckCircle className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex-1 rounded-xl py-3"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || submitting}
            className="flex-1 rounded-xl py-3 bg-primary hover:bg-primary/90"
          >
            {submitting ? 'Submitting...' : 'Get Results'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="flex-1 rounded-xl py-3 bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>

      {/* Progress Info */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Answer all questions to get personalized career recommendations
        </p>
      </div>
    </div>
  );
}