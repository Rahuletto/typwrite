import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { paragraphs } from "../../utils/paragraph";
import { Input } from "~/components/Input";

export default function Home() {
  const [input, setInput] = createSignal("");
  const [para, setPara] = createSignal("");

  const [mistakes, setMistakes] = createSignal(0);
  const [isTyping, setIsTyping] = createSignal(false);

  const [timer, setTimer] = createSignal(60);
  const [max, setMax] = createSignal(60);
  const [interv, setInterv] = createSignal<any>(null);

  const [wpm, setWpm] = createSignal(60);

  onCleanup(() => interv() && clearInterval(interv()));

  createEffect(() => {
    setTimer(max());
  });

  createEffect(() => {
    if (input() == "") {
      reset(true);
    }
  });

  function reset(soft?: boolean) {
    setMistakes(0);
    setTimer(max());
    setIsTyping(false);
    setWpm(0);
    setInput("");
    clearInterval(interv());

    if (!soft) refreshParagraph();

    const typingText = document.getElementById("typing-box");
    if (!typingText) return;

    let characters = typingText.querySelectorAll("span");
    characters.forEach((span) => span.classList.remove("active"));
    characters.forEach((span) => span.classList.remove("incorrect"));
    characters.forEach((span) => span.classList.remove("correct"));
  }

  createEffect(() => {
    if (timer() === 0) {
      clearInterval(interv());
      const inputField = document.getElementById("input");
      inputField?.blur();
      inputField?.setAttribute("disabled", "true");
    }
  });

  function focus() {
    const inputField = document.getElementById("input");
    inputField?.focus();
  }

  function refreshParagraph() {
    setPara(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
  }

  function typing(letter: string) {
    const typingText = document.getElementById("typing-box");
    if (!typingText) return;

    const len = letter.length == 0 ? letter.length : letter.length - 1;

    let characters = typingText.querySelectorAll("span");
    let typedChar = letter.split("")[len];

    if (len < characters.length - 1 && timer() > 0) {
      if (!isTyping()) {
        setInterv(setInterval(() => setTimer((c) => c - 1), 1000));
        setIsTyping(true);
      } else {
        if (characters[len].classList.contains("incorrect")) {
          setMistakes(mistakes() - 1);
        } else if (typedChar !== para()[len]) {
          characters[len].classList.add("incorrect");
          setMistakes(mistakes() + 1);
        } else if (typedChar === para()[len]) {
          characters[len].classList.add("correct");
        }

        characters.forEach((span) => span.classList.remove("active"));
        characters[letter.length].classList.add("active");
        
        const tmp = [...characters]
        tmp.slice(letter.length).forEach((span) => span.classList.remove("correct"));
        tmp.slice(letter.length).forEach((span) => span.classList.remove("incorrect"));

        setWpm(Math.round(((len - mistakes()) / 5 / (max() - timer())) * 60));
        setWpm(wpm() < 0 || !wpm() || wpm() === Infinity ? 0 : wpm());
      }
    } else {
      clearInterval(interv());
      setInput("");
    }
  }

  onMount(() => {
    window.addEventListener("keydown", focus);
    refreshParagraph();

    return () => {
      window.removeEventListener("keydown", focus);
    };
  });

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <input
        id="input"
        value={input()}
        onInput={(e) => {
          setInput(e.target.value);
          typing(e.target.value);
        }}
        type="text"
        class="input-field"
      />
      <div class="content-box">
        <p id="typing-box" onClick={focus}>
          {para()
            .split("")
            .map((e) => (
              <span>{e}</span>
            ))}
        </p>
        <div class="content">
          <ul class="result-details">
            <li class="time">
              <span>
                <b>{timer()}</b>s
              </span>
            </li>
            <li class="mistake">
              <p>Mistakes:</p>
              <span>{mistakes()}</span>
            </li>
            <li class="wpm">
              <p>WPM:</p>
              <span>{wpm()}</span>
            </li>
          </ul>
          <button onClick={() => reset(false)}>Try Again</button>
        </div>
      </div>
    </main>
  );
}
