
import { createEffect, JSX } from "solid-js";

export type InputPropsType = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  defaultsValue?: string;
  onChange?: (event: ChangeEventType) => void;
};

export type ChangeEventDetailType = { value: string };
export type ChangeEventType = CustomEvent<ChangeEventDetailType>;

function applyInputTransform(
  text: string,
  inputType: InputEvent["inputType"],
  inputText: string,
  start: number,
  end: number
) {
  let newText: string;
  let newStart: number;
  if (start !== end) {
    newText = text.slice(0, start) + (inputText || "") + text.slice(end);
    newStart = start;
    if (inputType.startsWith("insert")) newStart++;
  } else if (inputType.startsWith("insert")) {
    newText = text.slice(0, start) + inputText + text.slice(end);
    newStart = start + inputText.length;
  } else if (inputType === "deleteContentBackward") {
    newStart = Math.max(0, start - 1);
    newText = text.slice(0, newStart) + text.slice(start);
  } else if (inputType === "deleteContentForward") {
    newText = text.slice(0, start) + text.slice(start + 1);
    newStart = start;
  } else {
    newText = text;
    newStart = start;
  }
  return [newText, newStart] as [string, number];
}

function removeProps<T extends Record<string, any>, E extends string>(
  props: T,
  names: E[]
): Omit<T, E[number]> {
  const newProps = {
    ...props,
  };
  for (const name of names) delete newProps[name];
  return newProps;
}

export function Input(props: InputPropsType) {
  let control!: HTMLInputElement;
  let lastStart: number | undefined;
  let first = true;

  createEffect(() => {
    if (first && typeof props.value !== "string") {
      control.value = props.defaultsValue ?? "";
    } else {
      control.value = props.value?.toString() ?? "";
      control.selectionStart = control.selectionEnd =
        lastStart ?? control.value.length;
    }
    first = false;
  });

  const inputProps = removeProps(props, ["defaultsValue", "onChange"]);

  return (
    <input
        id="input"
      {...inputProps}
      ref={control}
      onBeforeInput={(event) => {
        if (typeof props.onBeforeInput === "function")
          props.onBeforeInput(event);
        if (typeof props.value === "string") {
          if (typeof control.selectionStart !== "number")
            throw new Error(`'selectionStart' can not be null`);
          if (typeof control.selectionEnd !== "number")
            throw new Error(`'selectionEnd' can not be null`);
          const [value, start] = applyInputTransform(
            control.value,
            event.inputType,
            event.data || "",
            control.selectionStart,
            control.selectionEnd
          );
        lastStart = start;
        if (props.onChange) {
            const event = new CustomEvent<ChangeEventDetailType>("change", {
                detail: {
                    value,
                },
            });
            control.dispatchEvent(event);
            props.onChange(event);
        }
        event.preventDefault();
        }
      }}
    />
  );
}