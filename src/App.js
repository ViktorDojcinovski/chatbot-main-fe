import "./App.css";
import { useEffect, useState } from "react";
import { createBot } from "botui";
import { BotUI, BotUIAction, BotUIMessageList } from "@botui/react";

const myBot = createBot();

const InputAction = () => {
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (inputValue.trim() === "") return;

    myBot.message.add({ text: inputValue }).then(() => {
      fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: "user", message: inputValue }),
      })
        .then((response) => response.json())
        .then((data) => {
          data.forEach((msg) => {
            myBot.message.add({ text: msg.text });
          });
          setInputValue(""); // Clear input after sending
          setTimeout(() => {
            myBot.action.set({}, { actionType: "input" }).then(() => {
              console.log("Input action reset after message");
            });
          }, 100);
        });
    });
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message here..."
      />
      <button className="botui_button" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

function App() {
  useEffect(() => {
    myBot.wait({ waitTime: 2000 }).then(() => {
      askForInput();
    });
  }, []);

  const askForInput = () => {
    console.log("Setting input action");
    myBot.action.set({}, { actionType: "input" }).then(() => {
      console.log("Input action se");
    });
  };

  return (
    <div>
      <BotUI bot={myBot}>
        <BotUIMessageList />
        <BotUIAction renderer={{ input: InputAction }} />
      </BotUI>
    </div>
  );
}

export default App;
