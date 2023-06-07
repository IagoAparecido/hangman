import { useState, useEffect, useCallback } from "react";

import wordListWithHints from "./wordList.json";
import HangmanDrawing from "./components/HangmanDrawing";
import HangmanWord from "./components/HangmanWord";
import { Keyboard } from "./components/Keyboard";

import styles from "./App.module.css";

function App() {
  const [wordToGuess] = useState(() => {
    const randomWord =
      wordListWithHints[Math.floor(Math.random() * wordListWithHints.length)];
    return randomWord.word;
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isLoser, isWinner]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  const currentWord = wordListWithHints.find(
    (wordObj) => wordObj.word === wordToGuess
  );

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        {isWinner && (
          <div className={styles.container_reload}>
            <div style={{ color: "green" }}>Parabéns!</div>
            <div className={styles.reload}>
              <img
                className={styles.img_reload}
                src="../src/assets/icon-reload.svg"
                alt="Reload"
                onClick={() => refreshPage()}
              />
            </div>
          </div>
        )}
        {isLoser && (
          <div className={styles.container_reload}>
            <div style={{ color: "red" }}>Perdeu!</div>
            <div className={styles.reload}>
              <img
                className={styles.img_reload}
                src="../src/assets/icon-reload.svg"
                alt="Reload"
                onClick={() => refreshPage()}
              />
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize: "1.5rem" }}>Dica: {currentWord?.hint}</div>{" "}
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
