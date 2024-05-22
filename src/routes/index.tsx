import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { paragraphs } from "../../utils/paragraph";

export default function Home() {
  const [input, setInput] = createSignal("");
  const [para, setPara] = createSignal("");

  const [mistakes, setMistakes] = createSignal(0);
  const [init, setInit] = createSignal(true);
  const [isTyping, setIsTyping] = createSignal(false);

  const [timer, setTimer] = createSignal(60);
  const [max, setMax] = createSignal(60);
  const [interv, setInterv] = createSignal<any>(null);

  const [wpm, setWpm] = createSignal(0);

  onCleanup(() => interv() && clearInterval(interv()));

  createEffect(() => {
    setTimer(max());
  });

  createEffect(() => {
    if (!interv()) {
      setInput(input().slice(0, -1));
    }
  });

  function reset(soft?: boolean) {
    setMistakes(0);
    setTimer(max());
    setIsTyping(false);
    setWpm(0);
    setInput("");
    clearInterval(interv());
    setInterv(null);
    if (!soft) {
      setInit(true);
      refreshParagraph();
    }

    const typingText = document.getElementById("typing-box");
    if (!typingText) return;

    let characters = typingText.querySelectorAll("span");

    characters.forEach((span) => span.classList.remove("active"));
    characters.forEach((span) => span.classList.remove("incorrect"));
    characters.forEach((span) => span.classList.remove("text-color"));
  }

  createEffect(() => {
    if (timer() === 0) {
      clearInterval(interv());
      const inputField = document.getElementById("input");
      inputField?.blur();
      inputField?.setAttribute("disabled", "true");
    }
  });

  function focus(key: KeyboardEvent) {
    if (
      (key.key.toLowerCase() == "v" || key.key.toLowerCase() == "c") &&
      (key.ctrlKey || key.metaKey)
    )
      key.preventDefault();

    const inputField = document.getElementById("input");
    inputField?.focus();

    if (key.key == "/") window.location.reload();
  }

  function refreshParagraph() {
    setPara(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
  }

  function typing(letter: string) {
    const typingText = document.getElementById("typing-box");
    if (!typingText) return;

    const len = letter.length <= 0 ? 0 : letter.length - 1;

    let characters = typingText.querySelectorAll("span");
    let typedChar = letter.split("")[len];

    if (len < characters.length - 1 && timer() > 0) {
      if (!isTyping()) {
        setInterv(setInterval(() => setTimer((c) => c - 1), 1000));
        setIsTyping(true);
      } else {
        if (input() == "") reset(true);
        if (characters[len + 1].classList.contains("incorrect")) {
        } else if (typedChar !== para()[len]) {
          characters[len].classList.add("incorrect");
        } else if (typedChar === para()[len]) {
          characters[len].classList.add("text-color");
        }

        characters.forEach((span) => span.classList.remove("active"));
        characters[letter.length].classList.add("active");

        const tmp = [...characters];
        tmp
          .slice(letter.length)
          .forEach((span) => span.classList.remove("incorrect"));
        tmp
          .slice(letter.length)
          .forEach((span) => span.classList.remove("text-color"));

        setMistakes(document.querySelectorAll("span.incorrect").length);

        setWpm(Math.round(((len - mistakes()) / 5 / (max() - timer())) * 60));
        setWpm(wpm() < 0 || !wpm() || wpm() === Infinity ? 0 : wpm());
      }
    } else {
      clearInterval(interv());
      setInterv(null);
      setInit(false);
      setIsTyping(false);
    }
  }

  onMount(() => {
    document.body.focus();

    window.addEventListener("keydown", focus);
    refreshParagraph();

    return () => {
      window.removeEventListener("keydown", focus);
    };
  });

  return (
    <main
      class="h-screen grid grid-cols-[0.1fr_1fr] grid-rows-[0.1fr_1fr] gap-x-0 gap-y-0"
    >
      <div class="flex items-center justify-center border-dashed border-dash border-r-2 border-b-2">
        <svg
        class="h-[40px] w-[40px]" 
          xmlns="http://www.w3.org/2000/svg"
          width="125"
          height="116"
          viewBox="0 0 125 116"
          fill="none"
        >
          <path
            d="M11 11L114 11"
            stroke="#E7856F"
            stroke-width="21"
            stroke-linecap="round"
          />
          <path
            d="M37 43L64 43"
            stroke="#E7856F"
            stroke-width="21"
            stroke-linecap="round"
          />
          <path
            d="M55 74L82 74"
            stroke="#E7856F"
            stroke-width="21"
            stroke-linecap="round"
          />
          <path
            d="M48 105L75 105"
            stroke="#E7856F"
            stroke-width="21"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <span />
      <span />
      <div class="text-center mx-auto text-gray-700 border-dashed border-dash border-t-2 border-l-2">
        {!isTyping() && init() && (
          <div class="w-full absolute backdrop-blur-md top-0 left-0 w-full h-full flex items-center justify-center">
            <h3 class="text-color text-5xl">
              Tap{" "}
              <kbd class="rounded-lg bg-accent text-bg px-2 py-1">space</kbd> to
              start
            </h3>
          </div>
        )}

        <div class="flex flex-col gap-12 pr-8">
          <h3 id="typing-box" class="text-left text-3xl text-disabled p-8">
            {para()
              .split("")
              .map((e) => (
                <span>{e}</span>
              ))}
          </h3>

          <div class="flex justify-between p-8 items-center">
            <button
              onClick={() => {
                reset(false);
              }}
              class="flex flex-row gap-2 justify-between items-center bg-red rounded-full text-2xl px-12 py-3 text-bg text-bold"
            >
              Restart
            </button>
            <div class="flex gap-6 justify-between items-center">
              <div class="flex flex-row gap-2 justify-between items-center bg-accent rounded-full text-2xl px-4 py-3 text-bg text-bold">
                <svg
                  class="w-[32px] h-[32px] text-bg stroke-current fill-current"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="32px"
                  width="32px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z"></path>
                </svg>
                {mistakes()}
              </div>

              <div class="flex flex-row gap-2 justify-between items-center bg-bg border-accent border-2 rounded-full text-xl px-4 py-3 text-accent text-bold">
                <svg
                  class="w-[32px] h-[32px] text-accent stroke-current fill-current"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 448 512"
                  height="32px"
                  width="32px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H362.7c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h69.6c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z"></path>
                </svg>
                <span>{wpm()} wpm</span>
              </div>
            </div>

            <span
              id="timer"
              class={`text-center items-center justify-center z-[1] ${
                timer() == 0 ? "bg-red" : "bg-accent"
              } flex items-center align-center text-bg p-4 rounded-full text-4xl w-[96px] h-[96px]`}
            >
              {isTyping() ? (
                <b>{timer()}</b>
              ) : (
                <input
                  id="timer"
                  class="text-bold bg-transparent w-[48px] text-center"
                  type="number"
                  value={max()}
                  onInput={(e) => setMax(Number(e.target.value))}
                />
              )}
            </span>
          </div>
          <input
            class="opacity-0"
            id="input"
            value={input()}
            onInput={(e) => {
              setInput(e.target.value);
              typing(e.target.value);
            }}
            type="text"
          />
        </div>
      </div>
    </main>
  );
}
