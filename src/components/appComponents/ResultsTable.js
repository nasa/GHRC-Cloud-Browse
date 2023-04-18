import { DataGrid, gridClasses } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useGetGranSearchQuery } from '../../feature/api/apiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { XMLParser } from 'fast-xml-parser'
import { setSelectedList } from '../../feature/selectedListSlice'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'
import { setCrumb } from '../../feature/crumbSlice'
import { isImage } from '../../lib/isImage'
import { alpha, Backdrop } from '@mui/material'
import config from '../../config'
import { useHref } from 'react-router-dom'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../../App.css'
import FileViewer from 'react-file-viewer';
import TextFileViewer from "./TextFileViewer";
import printJS from 'print-js';

import {FaDownload, FaPrint} from "react-icons/fa";
//**********variable and class delarations**********/
const parser = new XMLParser()

//**********React component**********
const ResultsTable = ({ skip, setSkipTrue, setSkipFalse }) => {

    //**********State Variables**********
    const search = useSelector(state => state.search.value)
    const delim = useSelector(state => state.delim.value)
    const dispatch = useDispatch()
    const [response, setResponse] = useState([]) 
    const [open, setOpen] = useState(false)
    const [img, setImg] = useState('')


    //*********************table Layout **************** */
    const granColumns = [
        //columbs layout for when granules are returned
        {
            field: 'name', 
            headerName: 'Name', 
            flex: 3,
            valueGetter: (params) => 
            `${getFName(params.row.Key)}`
        },
        {
            field: 'fileType',
            headerName: 'File Type',
            flex: 0.5,
            valueGetter: (params) => `${getFType(params.row.Key)}`
        },
        {field: 'LastModified', headerName: 'Last Modified', flex: 2, type: 'dateTime',
            valueGetter: ({value}) => value && new Date(value)},
        {field: 'Size', headerName: 'Size', flex: 1, valueGetter: (params) => `${getFSize(params.row.Size)}`},
    ]


    //**************Table Layout Functions*************** */
    const getFName = (uri) => {
        //takes in a uri and return granule name
        
        if(uri === undefined){return 'Loading'}

        if(uri.slice(-1) === '/'){
            var index = uri.indexOf(search);
            var result = uri.slice(0, index) + uri.slice(index + search.length);
            return result
        }
        console.log(uri);
        const temp = uri.split('/')
        return temp.pop()
    }


    const getFType = (uri) => {
        if(uri === undefined){return ''}
        if(uri.slice(-1) === '/'){
            return 'Folder'
        }
        const temp = uri.split('.')
        return temp.pop()
    }

    const convertToList = (data) => {

        // XML parser may return a object on single occurence, this captures the edge case
        if(!Array.isArray(data)){
           var tmpObject = [data]
           return tmpObject   
        }
        return data
    }


    const getFSize = (rawSize) => {
        if(rawSize === undefined){return ''}
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (rawSize === 0) return '0 Bytes';
        const ii = parseInt(Math.floor(Math.log(rawSize) / Math.log(1024)), 10);
        return `${(rawSize / (1024 ** ii)).toPrecision(4)} ${sizes[ii]}`;
    }
    const isfolder = (path)  => {
        return path.endsWith('/');
    }

    //**********State Functions**********
    const processResp = (resp) =>{
        //process the response from the api call into an array of objects
        //for use in the data grid
        const xml = resp
        const json = parser.parse(xml)
        console.log(json)
        var jResp;
        var responseFolder;
        var responseObject;
        var processedResp = []

        // console.log(json['ListBucketResult']['Prefix'])
        if(json['ListBucketResult']['CommonPrefixes'])
        { 
            responseFolder= convertToList(json['ListBucketResult']['CommonPrefixes'])
            
            responseFolder.forEach(element => {
                if(element['Prefix'] === json['ListBucketResult']['Prefix']){
                    // Ignore this folder, as it is the root folder
                    processedResp.push({Key: element['Prefix']})
                } else if (isfolder(element['Prefix'])) {
                    // console.log(element['Prefix'].split('/').reverse()[1])
                    var folderName = element['Prefix'].split('/').reverse()[1]
                    // console.log(folderName)
                    processedResp.push({Key: element['Prefix']})
                } else {
                    console.log('capture me')
                    console.log(element['Prefix'])
                    
                }
                
            });
           
        } 
        
        if(json['ListBucketResult']['Contents']){
            // console.log('here')
            responseObject = convertToList(json['ListBucketResult']['Contents'])

            responseObject.forEach(element => {
                // console.log(element['Key'])
                // processedResp.push({Key: element['Key'], Size: element['Size'], LastModified: element['LastModified']})
                if(element['Size'] === 0){
                    // Ignore this folder, as it is the root folder
                    console.log(element['Key'])
                } 
                else 
                if (isfolder(element['Key'])) {
                    console.log('folder')
                    processedResp.push({Key: element['Key']})
                } 
                else {
                    console.log('found')
                    processedResp.push({Key: element['Key'], Size: element['Size'], LastModified: element['LastModified']})  
                }
                
            });
   
        }

        console.log(processedResp)
        setResponse(processedResp)
        setSkipTrue()

    }

    const updateBrowserURL  = (id) => {
        var currentUrl = window.location.href;

        // Modify the URL
        var newUrl = currentUrl + '#' + id;

        // Change the URL without reloading the page
        window.history.pushState({ path: newUrl }, '', newUrl);
    }



    const handleCellDoubleClick  = (id) => {
        // console.log('id: '+id);
        //handles double click of a columb and queries a file 
        //if the double clicked columb is a file
        if(id.slice(-1) === '/'){
            console.log(id.slice(-1));
            setSkipFalse()
            dispatch(setDelim('/'))
            dispatch(setSearch(id))
            dispatch(setCrumb(id))
            


        } else if (isImage(id)){
            setImg(id)
            handleToggle()
        }
        // updateBrowserURL(id)
    }


    const handleClose = () => {
        setOpen(false)
        setImg('')
    }
    const handleToggle = () => {setOpen(!open);}


    //**********Api Logic**********
    const {
        data: resp,
        isSuccess,
        isError,
        error
    } = useGetGranSearchQuery({search, delim},
        {refetchOnMountOrArgChange: false,
        skip: skip,})

    useEffect(() => {
        //low level handling of api response
        if(isSuccess){
            processResp(resp)      
        } else if(isError){
            console.log(error)
            if(error.includes('404')) {href('/404')}
        }
    }, [resp])


    const useMyHref = (to) => {useHref(to)}
    const href = useMyHref


    //**********data table styling
    const ODD_OPACITY = 0.2

   //Download file after viewing
    const downloadFile = (fileUrl) => {
        console.log('file url', fileUrl)
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

    const checkFormat = isImage(img) === 'pdf' || isImage(img) === 'jpeg' || isImage(img) === 'png' || isImage(img) === 'gif';
    //**********jsx html**********
  return (
    <div style={{height: 635, width: '90%'}}>
        <DataGrid
            sx={{
                '& .MuiDataGrid-cell:hover':{cursor:'pointer'},
                [`& .${gridClasses.row}.even`]:{
                    backgroundColor: '#e3e3e3',
                    '&:hover, &.Mui-hovered':{
                        backgroundColor: alpha('#c1d5f7', ODD_OPACITY),
                    },
                    '&.Mui-selected': {
                        backgroundColor: alpha('#7ca7f7', ODD_OPACITY),
                        '&:hover, &.Mui-hovered':{
                            backgroundColor: alpha('#c1d5f7', ODD_OPACITY),
                        }
                    }
                },
                borderRadius: 2,
            }}
            rows={response}
            columns={granColumns}
            rowsPerPageOptions={[10, 25, 50, 100]}
            checkboxSelection= {true}
            getRowId={row => row.Key}
            onSelectionModelChange={(id) => {
                {/*handles the selction of rows*/}
                const selectedIDs = new Set(id)
                const selectedRowData = response.filter((row) =>
                selectedIDs.has(row.Key))
                dispatch(setSelectedList(selectedRowData))
            }}
            onRowClick={(row) => {handleCellDoubleClick(row['id'])}} 
            // onCellClick   onCellDoubleClick  onRowClick
            getRowClassName={(params) => 
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
        />
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
        >
            {checkFormat?
                <div style={{ height: "100%", width: "100%", "text-align":"center" }}>
                    <h2 className="file-name">{`${config.cloudWatchUrlBase}${img}`.split('/').pop()}
                        <span /*style={{ float: 'right' }}*/>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() =>   printJS({printable: `${config.cloudWatchUrlBase}${img}`, type: isImage(img) !== 'pdf' ? 'image':'pdf'})}><FaPrint className="fa-download-print" size={32} title="Print" /></button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => downloadFile(`${config.cloudWatchUrlBase}${img}`)}><FaDownload className="fa-download-print" size={32} title="Download" /></button>
                            </span>
                        </span>
                    </h2>
                    <FileViewer
                        fileType={isImage(img)}
                        filePath={`${config.cloudWatchUrlBase}${img}`}
                        errorComponent={() => <div>Sorry, we could not load the document.</div>}
                    />
                    );</div>:""
            }
            {
                !checkFormat && isImage(img) === 'text'? <TextFileViewer fileUrl={`${config.cloudWatchUrlBase}${img}`}/>:''
            }
            {
                !checkFormat && isImage(img) !== 'text'?
                    <div style={{ "text-align":"center" , top: "50%", left: "50%"}}>
                        <h2 className="file-name">{`${config.cloudWatchUrlBase}${img}`.split('/').pop()}
                            <span /*style={{ float: 'right' }}*/>

                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => downloadFile(`${config.cloudWatchUrlBase}${img}`)}><FaDownload className="fa-download-print" size={40} title="Download" /></button>
                            </span>
                        </span>
                        </h2>
                        </div>:""
            }
        </Backdrop>
</div>
  )
}

//**********React component return**********
export default ResultsTable