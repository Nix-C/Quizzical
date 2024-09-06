import { useEffect, useState } from "react";
import Question from "./Question";
import PropTypes from "prop-types";
import { randomOrder } from "../helpers/order-helper";
import Confetti from "react-confetti";

export default function Quiz({ size, closeQuiz }) {
  const [quiz, setQuiz] = useState();
  const [quizActive, setQuizActive] = useState(true);
  const [score, setScore] = useState(0);
  const [restarting, setRestarting] = useState(false);
  // Something I saw someone else do was use this ☝️ state to trigger useEffect, reguardless of
  // its value. I wonder if that's good or not? I prefer explicit values, so I specify and control
  // the state completely.

  useEffect(() => {
    // Restart quiz
    if (restarting === true) {
      setScore(0);
      setQuizActive(true);
      setRestarting(false);
    }

    // Light debouncing logic
    if (!quiz || restarting) {
      // Get quiz question from opentdb
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
    }
  }, [size, restarting, quiz]);

  const handleSubmit = () => {
    let correct = 0;
    if (quiz) {
      for (let i = 0; i < quiz.length; i++) {
        if (quiz[i].user_answer === quiz[i].correct_answer) {
          correct++;
        }
      }
    }

    setScore(correct);
    setQuizActive(false);
  };

  const listQuestions = quiz?.map((question) => (
    <Question
      key={question.question}
      questionData={question}
      quizActive={quizActive}
      handleChange={handleChange}
    />
  ));

  function handleChange(event) {
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
  }

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
            <button className="button" onClick={() => setRestarting(true)}>
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
