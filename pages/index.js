import { useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const Form = styled.div`
  margin-left: 5%;
`;

const Kontejner = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  const [file, setFile] = useState("");
  // Result bude array se dvěma jsony - Každý result se namapuje do vlastního code mirroru
  const [result, setResult] = useState("");
  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      console.log("e.target.result", e.target.result);
      setFile(e.target.result);
    };
  };

  const processJson = () => {
    console.log("Do your magic");
    setResult('Your result')
  };
  return (
    <Kontejner>
      <Form>
        <h1>Upload Json file</h1>

        <input type="file" onChange={handleChange} />
        <br />

        <CodeMirror
          value={file}
          height="400px"
          width="100%"
          extensions={[javascript({ jsx: true })]}
          onChange={(value, viewUpdate) => {
            console.log("value:", value);
          }}
        />
      </Form>

      <Form>
        <h1>Result</h1>
        <button onClick={processJson}>Process json</button>

        <CodeMirror
          value={result}
          height="200px"
          width="100%"
          extensions={[javascript({ jsx: true })]}
          onChange={(value, viewUpdate) => {
            console.log("value:", value);
          }}
        />
      </Form>
    </Kontejner>
  );
}
