import { useCallback, useEffect, useState } from "react";
import Question from "./Question";
import PropTypes from "prop-types";
import { randomOrder } from "../helpers/order-helper";
import Confetti from "react-confetti";

function Quiz({ size, closeQuiz }) {
  const [quiz, setQuiz] = useState(null);
  const [quizActive, setQuizActive] = useState(true);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuiz = useCallback(() => {
    setIsLoading(true);
    const URL = `https://opentdb.com/api.php?amount=${size}`;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(
          data.results?.map((result) => ({
            ...result,
            user_answer: null,
            order: randomOrder(),
          }))
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setIsLoading(false);
      });
  }, [size]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleSubmit = () => {
    if (quiz) {
      const correct = quiz.reduce(
        (acc, question) =>
          question.user_answer === question.correct_answer ? acc + 1 : acc,
        0
      );
      setScore(correct);
      setQuizActive(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuiz((oldQuiz) =>
      oldQuiz.map((question) =>
        question.question === name
          ? { ...question, user_answer: value }
          : question
      )
    );
  };

  const restartQuiz = () => {
    setScore(0);
    setQuizActive(true);
    fetchQuiz();
  };

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  return (
    <>
      {score === size && !quizActive && <Confetti />}
      <div className={`Quiz ${quizActive ? "" : "End"}`}>
        <button className="closeQuiz" onClick={closeQuiz}>
          X
        </button>

        {quiz && (
          <form>
            {quiz.map((question) => (
              <Question
                key={question.question}
                questionData={question}
                quizActive={quizActive}
                handleChange={handleChange}
              />
            ))}
          </form>
        )}

        {quizActive ? (
          <div className="controls">
            <button className="button" onClick={handleSubmit}>
              Check answers
            </button>
          </div>
        ) : (
          <div className="controls">
            <p>
              You scored {score}/{size} correct answers
            </p>
            <button className="button" onClick={restartQuiz}>
              Play again
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;

Quiz.propTypes = {
  size: PropTypes.number.isRequired,
  closeQuiz: PropTypes.func,
};
