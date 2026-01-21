// import { useState, useEffect } from "react";
// import { Storage } from "@plasmohq/storage";
// import type { CandidateData } from "../types/candidate";

// function IndexPopup() {
//   const [status, setStatus] = useState("Ready");
//   const storage = new Storage();

//   useEffect(() => {
//     loadCandidateData();
//   }, []);

//   const loadCandidateData = async () => {
//     // In production, load from storage or API
//     setStatus("Candidate data loaded");
//   };

//   const handleApply = async () => {
//     setStatus("Auto-applying...");
    
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     if (tab.id) {
//       await chrome.tabs.sendMessage(tab.id, { action: "startAutoApply" });
//       setStatus("Application submitted!");
//     }
//   };

//   return (
//     <div style={{ padding: "16px", width: "300px" }}>
//       <h2>Job Auto Apply</h2>
//       <p>Status: {status}</p>
//       <button onClick={handleApply} style={{ marginTop: "10px" }}>
//         Start Auto Apply
//       </button>
//     </div>
//   );
// }

// export default IndexPopup;