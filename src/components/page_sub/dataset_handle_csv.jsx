import React, { useState, useEffect } from 'react';
   import { readString } from 'react-papaparse';

   function CSVViewer({ csvData }) {
     const [data, setData] = useState([]);
     const [header, setHeader] = useState([]);

     useEffect(() => {
       if (csvData) {
         const results = readString(csvData);
         if (results && results.data.length > 0) {
           setHeader(results.data[0]);
           setData(results.data.slice(1));
         }
       }
     }, [csvData]);

     return (
       <div>
         <table>
           <thead>
             <tr>
               {header.map((column, index) => (
                 <th key={index}>{column}</th>
               ))}
             </tr>
           </thead>
           <tbody>
             {data.map((row, rowIndex) => (
               <tr key={rowIndex}>
                 {row.map((cell, cellIndex) => (
                   <td key={cellIndex}>{cell}</td>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }

   export default CSVViewer;