import he from "he";
import { applyOrder } from "../helpers/order-helper";
import PropTypes from "prop-types";

export default function Question({ questionData, quizActive, handleChange }) {
  const {
    question,
    user_answer,
    correct_answer,
    incorrect_answers,
    type,
    order,
  } = questionData;

  const choices =
    type === "multiple"
      ? [
          <label
            key={correct_answer}
            className={!quizActive ? "correct" : null}
          >
            <input
              type="radio"
              value={correct_answer}
              name={question}
              checked={user_answer === correct_answer}
              onChange={handleChange}
            />
            {he.decode(correct_answer)}
          </label>,
          ...incorrect_answers.map((answer) => {
            return (
              <label key={answer}>
                <input
                  type="radio"
                  value={answer}
                  name={question}
                  checked={user_answer === answer}
                  onChange={handleChange}
                />
                {he.decode(answer)}
              </label>
            );
          }),
        ]
      : [
          <label
            key={"True"}
            className={!quizActive && correct_answer == "True" ? "correct" : ""}
          >
            <input
              type="radio"
              value={"True"}
              name={question}
              checked={user_answer === "True"}
              onChange={handleChange}
            />
            True
          </label>,
          <label
            key={"False"}
            className={
              !quizActive && correct_answer == "False" ? "correct" : ""
            }
          >
            <input
              type="radio"
              value={"False"}
              name={question}
              checked={user_answer === "False"}
              onChange={handleChange}
            />
            False
          </label>,
        ];

  const styles = {
    pointerEvents: quizActive ? "" : "none",
  };

  return (
    <div className="Question">
      <h2>{he.decode(question)}</h2>
      <fieldset style={styles}>
        {type === "multiple" ? applyOrder(choices, order) : choices}
      </fieldset>
    </div>
  );
}

Question.propTypes = {
  questionData: PropTypes.object.isRequired,
  quizActive: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
};
