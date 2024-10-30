import { useState ,useEffect} from "react";
import toast from "react-hot-toast";

function QuizCreator({SendQuiz}:any) {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", percentage: 0 }]);
  const [correctOption, setCorrectOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isbtnvisible,setIsBtnVisible]=useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const addOption = () => {
    setOptions([...options, { id: options.length + 1, text: "", percentage: 0 }]);
  };

  const handleOptionChange = (id, value) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, text: value } : option
    );
    setOptions(updatedOptions);
  };

  const handleCorrectOptionChange = (id) => {
    setCorrectOption(id);
  };

  const handleAddQuestion = () => {
    if (!questionText || options.some((option) => !option.text) || correctOption === null) {
      alert("Please complete all fields and select the correct answer.");
      return;
    }

    const newQuestion = {
      question: questionText,
      options,
      correctOptionId: correctOption,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setOptions([{ id: 1, text: "", percentage: 0 }]);
    setCorrectOption(null);
    
  };
console.log(questions);
  // Automatically countdown the timer
//handle send quiz 
useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer); // cleanup to prevent multiple intervals
    } else {
      setIsBtnVisible(false);
    }
  }, [timeLeft]); // run the effect whenever timeLeft changes

  const handleSendQuiz = (item) => {
    SendQuiz(item);
    setCurrentQuestion(item.question);
    setTimeLeft(10); // reset the timer if needed for a new quiz question
    toast.success("Quiz sent successfully!");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Create a New Quiz Question</h2>
     
      {/* Question Input */}
      <input
        type="text"
        placeholder="Enter question text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="p-2 mb-4 w-full max-w-md border border-gray-300 rounded-md"
      />

      {/* Options Input */}
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center mb-2 w-full max-w-md">
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option.text}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full mr-2"
          />
          <input
            type="radio"
            name="correctOption"
            checked={correctOption === option.id}
            onChange={() => handleCorrectOptionChange(option.id)}
            className="mr-2"
          />
          <span>Correct</span>
        </div>
      ))}

      {/* Add Option Button */}
      <button
        onClick={addOption}
        className="bg-blue-500 text-white py-1 px-4 rounded-lg mb-4 hover:bg-blue-600"
      >
        Add Another Option
      </button>

      {/* Add Question Button */}
      <button
        onClick={handleAddQuestion}
        className="bg-green-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-green-600"
      >
        Add Question to Quiz
      </button>

      {/* Display Added Questions */}
      <div className="w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">Quiz Preview</h3>
        {questions.map((item, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">

           <label
                className={`block p-3 border rounded-lg cursor-pointer `}
              >
                
                {item.question}
              </label>
              {item.question==currentQuestion&&<p className="text-gray-600 mb-4">Time left: {timeLeft} seconds</p>}
             {item.options.map((options,index)=>(<div key={index}>
                <label
                className={`block p-3 border rounded-lg cursor-pointer ${
                   options.id === item.correctOptionId&& "bg-green-100 border-green-500"
                      
                }`}
              >
               
                {options.text}
              </label>
             <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${options.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {options.percentage}% of users selected this
              </p>
              
              </div>
            
            ))}
          <button
           
           className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
          onClick={()=>handleSendQuiz(item)}
          disabled={!isbtnvisible}
         >
          Send Quiz
         </button>
         <button
           
           className="w-full mt-4 bg-indigo-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
          
         >
           Publish Result
         </button>
         <button
           
           className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
          
         >
           PublishLeader Board
         </button>
          </div>
          
        ))}
         
      </div>
    </div>
  );
}

export default QuizCreator;
