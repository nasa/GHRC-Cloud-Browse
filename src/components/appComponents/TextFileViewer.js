import React, { useState, useEffect } from 'react';
import {FaArrowLeft, FaArrowRight, FaDownload, FaPrint, FaTimes} from 'react-icons/fa';
import printJS from 'print-js';
import config from "../../config";

function TextFileViewer({ fileUrl, setOpen, setImg, img, response, setFilePath, showArrow }) {
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

    const handleClose = (event) => {
        setOpen(false);
        setImg('')
    };

    const handleArrow = (i, a) => {
        const currentImageIndex = response.findIndex((row2) => row2.Key === img);
        let id;
        if( a === 'r'){
            id = response[currentImageIndex+1]?response[currentImageIndex+1].Key:null
        }
        else if (a == 'l'){
            id = response[currentImageIndex-1]? response[currentImageIndex-1].Key:null
        }
        setFilePath(`${config.cloudWatchUrlBase}${id}`)
        if(id !== null) setImg(id)
        setOpen(true)
    };

    return (
        <div style={{ height: "100%", "textAlign":"center" }}>
            <h2 className="file-name">{fileUrl.split('/').pop()}
            <span className={'topRight'}>
                 {showArrow? <FaArrowLeft className={'printIcon cursorPtr'} title={"prev"} size={32} onClick={(e)=> handleArrow(img,'l')}/>:""}
                 <span className={'printIcon'}>
                <button className={'downPrint'} onClick={printFile}><FaPrint className="fa-download-print" title="Print" size={32}/></button>
                 </span>
                      <span className={'printIcon'}>
                <button className={'downPrint'} onClick={downloadFile}><FaDownload className="fa-download-print" title="Download" size={32}/></button>
                      </span>

                        <FaTimes onClick={handleClose} title={'Close'} className={'printIcon downPrint'} size={36}/>
                {showArrow? <FaArrowRight className={'printIcon cursorPtr'} title={"next"} size={32} onClick={(e)=> handleArrow(img,'r')}/>:""}

            </span></h2>
        <div style={{
            background: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            padding: '8px',
            fontFamily: 'Courier New, monospace',
            color: 'black'
        }}>
            <div key={fileUrl} className={'textScroll'}>
                    <pre >{text}</pre>
            </div>
        </div>
        </div>

    );
}

export default TextFileViewer;