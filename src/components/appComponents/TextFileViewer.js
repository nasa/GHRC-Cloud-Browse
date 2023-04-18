import React, { useState, useEffect } from 'react';
import { FaDownload, FaPrint } from 'react-icons/fa';
import printJS from 'print-js';

function TextFileViewer({ fileUrl }) {
    console.log('file url', fileUrl)
    const [text, setText] = useState('');
    useEffect(() => {
        fetch( fileUrl )
            .then(response => response.text())
            .then(data => {
                setText(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [fileUrl]);

    const downloadFile = () => {
        fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileUrl.split('/').pop());
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            });
    };

    const printFile = () => {

        /*const printWindow = window.open(fileUrl, "PRINT", "height=800,width=600");

        printWindow.onload = function() {
            printWindow.print();
        }*/
        printJS({printable: `<pre>${text}</pre>`, type: 'raw-html', style: `
      @page {
        size: 8.5in 11in;
        margin: 0.5in;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    `});

    };

    return (
        <div style={{ height: "100%", "text-align":"center" }}>
            <h2 className="file-name">{fileUrl.split('/').pop()}
            <span>
                 <span className={'printIcon'}>
                <button className={'downPrint'} onClick={printFile}><FaPrint className="fa-download-print" title="Print" size={32}/></button>
                 </span>
                      <span className={'printIcon'}>
                <button className={'downPrint'} onClick={downloadFile}><FaDownload className="fa-download-print" title="Download" size={32}/></button>
                      </span>
            </span></h2>
        <div style={{
            background: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            padding: '8px',
            fontFamily: 'Courier New, monospace',
            color: 'black'
        }}>
            <div /*style={{
                background: 'lightgray',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px'
            }}*/>

            </div>
            <div key={fileUrl} className={'textScroll'}>

                    <pre >{text}</pre>

            </div>
        </div>
        </div>

    );
}


export default TextFileViewer;