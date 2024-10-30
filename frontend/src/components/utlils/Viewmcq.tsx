import { useState, useEffect } from "react";

function Quiz({quizdata,message}:any) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState("");

  const question = "What is the capital of France?";
  const options = [
    { id: 1, text: "Berlin", percentage: 20 },
    { id: 2, text: "Madrid", percentage: 10 },
    { id: 3, text: "Paris", isCorrect: true, percentage: 50 },
    { id: 4, text: "Rome", percentage: 20 },
  ];

  // Automatically countdown the timer
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
    setError("");
  };

  const handleSubmit = () => {
    // Check if an option is selected
    if (selectedOption === null) {
      setError("Please select an option.");
    }
    setIsSubmitted(true);  // Submit answer regardless to show feedback after timer ends
  };

  const correctOption = options.find((option) => option.isCorrect);

  return (
    <>
    {quizdata==null&& <p className="mt-6 font-bold text-xl">
        Quiz Started! Questions will be {" "}
            <span className="bg-green-600 text-white p-2 ">displayed soon!</span>
          </p>}
    {quizdata!=null&&<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-xl font-semibold mb-2">{question}</h1>
        <p className="text-gray-600 mb-4">Time left: {timeLeft} seconds</p>

        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex flex-col">
              <label
                className={`block p-3 border rounded-lg cursor-pointer ${
                  isSubmitted
                    ? option.id === correctOption.id
                      ? "bg-green-100 border-green-500"
                      : selectedOption === option.id
                      ? "bg-red-100 border-red-500"
                      : "bg-gray-50"
                    : selectedOption === option.id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => handleOptionChange(option.id)}
                  className="mr-2"
                />
                {option.text}
              </label>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${option.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {option.percentage}% of users selected this
              </p>
            </div>
          ))}
        </div>

        {error && !selectedOption && <p className="text-red-600 mt-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
          disabled={isSubmitted}
        >
          Submit
        </button>

        {isSubmitted && selectedOption !== null && (
          <div className="mt-4">
            {selectedOption === correctOption.id ? (
              <p className="text-green-600 font-semibold">Correct Answer!</p>
            ) : (
              <p className="text-red-600 font-semibold">Incorrect Answer.</p>
            )}
          </div>
        )}
      </div>
    </div>}
    </>
  );
}

export default Quiz;
