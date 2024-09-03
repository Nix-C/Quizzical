import { useState } from "react";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [size, setSize] = useState(5);

  function initQuiz(e) {
    e.preventDefault();
    setStartQuiz(true);
  }

  return (
    <>
      {startQuiz ? (
        <Quiz
          size={parseInt(size)}
          closeQuiz={() => {
            setStartQuiz(false);
          }}
        />
      ) : (
        <div className="startScreen">
          <h1>Quizzical</h1>
          <p>
            By Nathaniel Campbell (
            <a href="https://github.com/Nix-C" target="_blank">
              Nix-C
            </a>
            )
          </p>
          <small>
            A solo project from{" "}
            <a href="https://scrimba.com" target="_blank">
              Scrimba.com
            </a>
          </small>
          <button className="startQuiz button" onClick={(e) => initQuiz(e)}>
            Start quiz
          </button>
          <form>
            Select quiz size:
            <label>
              <input
                type="radio"
                name="size"
                id="size"
                checked={size == 3}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
                value={3}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                name="size"
                id="size"
                checked={size == 5}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
                value={5}
              />
              5
            </label>
            <label>
              <input
                type="radio"
                name="size"
                id="size"
                checked={size == 8}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
                value={8}
              />
              8
            </label>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
