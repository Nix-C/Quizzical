import { useEffect, useState } from "react";
import Question from "./Question";
import PropTypes from "prop-types";
import { randomOrder } from "../helpers/order-helper";
import Confetti from "react-confetti";

export default function Quiz({ size, closeQuiz }) {
  const [quiz, setQuiz] = useState();
  const [quizActive, setQuizActive] = useState(true);
  const [score, setScore] = useState(0);

  const getQuiz = (size) => {
    console.log("Getting quiz data");
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
      });
  };

  const handleRestart = (size) => {
    setScore(0);
    getQuiz(size);
    setQuizActive(true);
  };

  const handleSubmit = () => {
    if (quiz) {
      // Tally correct answers using .reduce method! (per Justin)
      const correct = quiz.reduce(
        (
          acc,
          question // acc == accumulator
        ) => (question.user_answer === question.correct_answer ? acc + 1 : acc), // comparison logic
        0 // initial value
      );

      setScore(correct);
      setQuizActive(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setQuiz((oldQuiz) => {
      return oldQuiz.map((question) => {
        if (question.question === name) {
          return {
            ...question,
            user_answer: value,
          };
        }
        return question;
      });
    });
  };

  const listQuestions = quiz?.map((question) => (
    <Question
      key={question.question}
      questionData={question}
      quizActive={quizActive}
      handleChange={handleChange}
    />
  ));

  // init quiz
  useEffect(() => getQuiz(size), []);

  return (
    <>
      {score == size && !quizActive && <Confetti />}
      <div className={`Quiz ${quizActive ? "" : "End"}`}>
        <button className="closeQuiz" onClick={closeQuiz}>
          X
        </button>

        {quiz && <form>{listQuestions}</form>}

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
            <button className="button" onClick={() => handleRestart(size)}>
              Play again
            </button>
          </div>
        )}
      </div>
    </>
  );
}

Quiz.propTypes = {
  size: PropTypes.number.isRequired,
  closeQuiz: PropTypes.func,
};
