import { useEffect, useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import yaml from 'js-yaml'
import 'core-js/features/array/at';




const Form = styled.div`
  margin-left: 5%;
`;

const Kontejner = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  const [json,setJson] = useState('')
  const [separatedJSON, setSeparatedJSON] = useState([])
  const [file, setFile] = useState("");
  // Result bude array se dvěma jsony - Každý result se namapuje do vlastního code mirroru
  const [result, setResult] = useState([]);
  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const obj = yaml.load(e.target.result);
      setJson(obj);
      setFile(e.target.result);
    };
  };

  const processJson = (json) => {
    let results = {};
    const endpoints = json.paths;

    // loop endpoints
    for(let key in endpoints){
      const paths = {[key]: endpoints[key]};
      const newSpecification = Object.assign({}, {...json });
      const endpoint = endpoints[key];

      // loop methods in particular endpoint
      for(let method in endpoint){
        let tags = endpoint[method]['tags'];

        // Blockchain / Exchange / Trade
        const tag = tags[0].replace(/\s/g, '');

        // Blockchain/Exchange
        const fileName = tag.split('/').slice(0,-1).join('/');

        // Trade
        const newFileTag = tag.split('/').at(-1);

        if(results.hasOwnProperty(fileName)){
          // if endpoint already exists
          if(results[fileName]['paths'].hasOwnProperty(key)){
              results[fileName]['paths'][key] = {...results[fileName]['paths'][key], [method]: endpoint[method] }
          } else {
            results[fileName]['paths'][key] = {[method]: endpoint[method]}
          }
        } else {
          const endpointMethod = endpoint[method];
          const apiSpecification = Object.assign({}, {...newSpecification, tags: newFileTag, paths: {[key]: {[method]: endpointMethod}} })
          results[fileName] = apiSpecification;
        }
      
      }
      
    }
    for(let key in results){
      setResult(prev => [...prev, results[key]]);
    }
    console.log('result',results)
    // setResult(result)
  };

  useEffect(() => {
    processJson(json);
  },[file])




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
      {result.map((json,index) => {
        return <Form key={index}>
        <h1>Result</h1>
        <button onClick={processJson}>Process json</button>
        <CodeMirror
          value={JSON.stringify(json,null,2)}
          height="400px"
          width="100%"
          extensions={[javascript({ jsx: true })]}
          onChange={(value, viewUpdate) => {
            console.log("value:", value);
          }}
        />
      </Form>
      })}
    </Kontejner>
  );
}
