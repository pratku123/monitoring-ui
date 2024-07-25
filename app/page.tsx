'use client';
import { FormEvent } from "react";
//http://localhost:3000/logs?numberOfLogs=30&logFileName=abc&startIndex=1010023&endIndex=1009994

let fetchRequestJson = null;
let currentLogs = [];
let responseJson = null;

async function fetchLogs(fetchRequestData: any) {
  let getLogsUrl = "http://localhost:3000/logs?";
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
  const response = await fetch(getLogsUrl);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json(); 
  responseJson = json;
}

function appendLogsStart() {

}

function appendLogsEnd() {

}



export default function MonitoringHome() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const numberOfLogs = formData.get("numberOfLogs");
    const logFileName = formData.get("logFileName");
    if(!logFileName){
      return;
    }
    let fetchRequestData = {
      numberOfLogs,
      logFileName
    };
    fetchRequestJson = fetchRequestData;
    fetchLogs(fetchRequestData);
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
      <form>
        Load more latest logs
      </form>
      <form>
        Load more older logs
      </form>
      </div>
    </main>
  );
}
