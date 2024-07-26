'use client';
import { FormEvent, useState } from "react";
//http://localhost:3000/logs?numberOfLogs=30&logFileName=abc&startIndex=1010023&endIndex=1009994

// let currentLogs: string[] = [];
let currentResponse: any = {};
let fetchRequest: any = {};

async function fetchLogs(fetchRequestData: any) {
  let getLogsUrl = "http://localhost:3000/logs/get?";
  getLogsUrl = getLogsUrl + "logFileName="+ fetchRequestData.logFileName;
  if(fetchRequestData.numberOfLogs) {
    getLogsUrl = getLogsUrl + "&numberOfLogs="+fetchRequestData.numberOfLogs;
  }
  if(fetchRequestData.startIndex) {
    getLogsUrl = getLogsUrl + "&startIndex="+fetchRequestData.startIndex;
  }
  if(fetchRequestData.endIndex) {
    getLogsUrl = getLogsUrl + "&endIndex="+fetchRequestData.endIndex;
  }
  if(fetchRequestData.rev) {
    getLogsUrl = getLogsUrl + "&rev="+fetchRequestData.rev;
  }
  return fetch(getLogsUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      return response.json();
    });
}

export default function MonitoringHome() {
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);

  function appendLogsStart(event: FormEvent<HTMLFormElement>) {

  }
  
  function appendLogsEnd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(currentResponse);
    let fetchRequestData = {
      numberOfLogs: fetchRequest.numberOfLogs,
      logFileName: fetchRequest.logFileName,
      startIndex: currentResponse.start,
      endIndex: currentResponse.end
    };

    fetchLogs(fetchRequestData)
    .then(r => {
      let response: any = r;
      fetchRequest = fetchRequestData;
      currentResponse = response.data;
      let oldLogs: string[] = currentLogs;
      let newLogs: string[] = currentResponse.logs;
      let logs = oldLogs.concat(newLogs);
      setCurrentLogs(logs);
    });
  
  }


  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let numberOfLogs = formData.get("numberOfLogs");
    let logFileName = formData.get("logFileName");
    if(!logFileName){
      return;
    }
    let fetchRequestData = {
      numberOfLogs,
      logFileName
    };

    fetchLogs(fetchRequestData)
    .then(r => {
      let response: any = r;
      fetchRequest = fetchRequestData;
      currentResponse = response.data;
      setCurrentLogs(currentResponse.logs);
    });
  }

  return (
    <main>
      <div>
      <form onSubmit = {onSubmit}>
        File Name<br/>
        <input type="text" name="logFileName" className="border-input"/><br/>
        Number of lines<br/>
        <input type="text" name="numberOfLogs" className="border-input"/>
        <br></br><br/>
        <button type="submit" className="submit-button">
          View Application logs
        </button>
      </form>
      <br></br>
      </div>
      <div>
      <form onSubmit={appendLogsEnd}>
        { currentLogs && currentLogs.length>0 &&
        <button className="load-logs">
          Load more latest logs
        </button>
        }
      </form>
      <div className="logs-table">
        {currentLogs.map((log, index) => (
          <div className="log-row"> {log} </div>
        ))}
      </div>
      <form onSubmit={appendLogsEnd}>
      { currentLogs && currentLogs.length>0 &&
        <button className="load-logs">
          Load more older logs
        </button>
      }
      </form>
      </div>
    </main>
  );
}
