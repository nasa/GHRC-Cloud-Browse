import { DataGrid, gridClasses } from '@mui/x-data-grid'
import React, { useEffect, useState , useRef } from 'react'
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
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { saveAs } from 'file-saver';
import '../../App.css'
import TextFileViewer from "./TextFileViewer";
import printJS from 'print-js';
import { FaDownload, FaPrint, FaArrowLeft, FaArrowRight, FaTimes, FaCheckCircle } from "react-icons/fa";
import { BiCartDownload } from 'react-icons/bi';
import { BiZoomIn, BiZoomOut } from "react-icons/bi"
import { TbZoomReset } from "react-icons/tb"
import { Viewer, Worker } from "@react-pdf-viewer/core";
import * as pdfjs from "pdfjs-dist";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import FileDownloader,{ downloadFile} from "../universal/FileDownloader";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";



//**********variable and class delarations**********/
const parser = new XMLParser()

//**********React component**********
const ResultsTable = ({ skip, setSkipTrue, setSkipFalse }) => {
    const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    //**********State Variables**********
    const search = useSelector(state => state.search.value)
    const delim = useSelector(state => state.delim.value)
    const dispatch = useDispatch()
    const [response, setResponse] = useState([])
    const [open, setOpen] = useState(false)
    const [img, setImg] = useState('')
    const [filePath, setFilePath] = useState();
    const [sortedData, setSortedData] = useState([]);
    const [showArrowLeft, setShowArrowLeft] = useState(true);
    const [showArrowRight, setShowArrowRight] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc')
    const transformComponentRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [urls, setUrls] = useState([]);
    const [rowData, setRowData] = useState();
    const [selectionModel, setSelectionModel] = useState([]);
    const [divHeight, setDivHeight] = useState(window.innerHeight - 450);

    //*********************table Layout **************** */
    const granColumns = [
        //columbs layout for when granules are returned
        {
            field: 'Key',
            headerName: 'Name',
            flex: 3,
            sortingOrder: ['desc', 'asc'],
            valueGetter: (params) =>
            `${getFName(params.row.Key)}`
        },
        {
            field: 'fileType',
            headerName: 'File Type',
            sortable: false,
            flex: 0.5,
            valueGetter: (params) => `${getFType(params.row.Key)}`
        },
        {field: 'LastModified', headerName: 'Last Modified', sortable: false, flex: 2, type: 'dateTime',
            valueGetter: ({value}) => value && new Date(value)},

        {field: 'Size', headerName: 'Size', flex: 1, sortable: false, valueGetter: (params) => `${getFSize(params.row.Size)}`},
    ]


    //**************Table Layout Functions*************** */
    const getFName = (uri) => {
        //takes in a uri and return granule name
        if(uri === undefined){return 'Loading'}

        if(uri.slice(-1) === '/'){
            var index = uri.indexOf(search);
            return  uri.slice(0, index) + uri.slice(index + search.length);
        }
        // console.log(uri);
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
           return [data]
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
        const json = parser.parse(resp)
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
                    // console.log(folderName)
                    processedResp.push({Key: element['Prefix']})
                } else {

                    // console.log(element['Prefix'])

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
                    // console.log(element['Key'])
                }
                else
                if (isfolder(element['Key'])) {
                    // console.log('folder')
                    processedResp.push({Key: element['Key']})
                }
                else {
                    // console.log('found')
                    processedResp.push({Key: element['Key'], Size: element['Size'], LastModified: element['LastModified']})
                }

            });

        }

        if(sortOrder === 'asc'){
            setResponse([...processedResp].sort((a, b) => a['Key'].localeCompare(b['Key'])))
        }else{
            setResponse([...processedResp].sort((a, b) => a['Key'].localeCompare(b['Key'])).reverse())
        }

        setSkipTrue()

    }

    const updateBrowserURL  = (id) => {

        // Modify the URL
        var newUrl =  'browseui/#' + id;
        // Change the URL without reloading the page
        window.history.pushState({ path: newUrl }, '', newUrl);
    }



    const handleCellDoubleClick  = (rows) => {
        const currentImageIndex = response.findIndex((row2) => row2.Key === rows.id);
        setShowArrowLeft(true)
        setShowArrowRight(true)
        if(currentImageIndex === 0 && (response.length-1) === 0){
            setShowArrowLeft(false)
            setShowArrowRight(false)
        }
        else if(currentImageIndex === 0){
            setShowArrowLeft(false)
        }else if(currentImageIndex === (response.length-1)){
            setShowArrowRight(false)
        }
        let id = rows['id']
        //To set the next image to original size
        setScale(1);
        // File preview
        setFilePath(`${config.cloudWatchUrlBase}${id}`, ()=>{
            setImg(id)
            setRowData(rows.row)
            setOpen(true)
        })

        // console.log('id: '+id);
        //handles double click of a columb and queries a file
        //if the double clicked columb is a file
        if(id.slice(-1) === '/'){
            // console.log(id.slice(-1));
            setSkipFalse()
            dispatch(setDelim('/'))
            dispatch(setSearch(id))
            dispatch(setCrumb(id))

        } else if (isImage(id)){
            setImg(id)
            setRowData(rows.row)
            setOpen(true)
           // handleToggle()
        }
        updateBrowserURL(id)
    }

    const handleNavigationClick = (row, direction) => {
        let img = row.Key
        //To set the next image to original size
        setScale(1);
        const currentImageIndex = response.findIndex((row2) => row2.Key === img);
        setShowArrowLeft(true)
        setShowArrowRight(true)

        if(currentImageIndex === 1 && direction === 'left'){
            setShowArrowLeft(false)
        }else if(currentImageIndex === (response.length-2) && direction === 'right'){
            setShowArrowRight(false)
        }

        if(direction === 'left'){
            if(currentImageIndex > 0){
                const id = response[currentImageIndex-1].Key
                setFilePath(`${config.cloudWatchUrlBase}${id}`)
                setRowData(response[currentImageIndex-1])
                setImg(id)
                updateBrowserURL(id)
                setOpen(true)
            }
        }else if(direction === 'right'){
            if(response && response.length > currentImageIndex+1){
                const id = response[currentImageIndex+1].Key
                setFilePath(`${config.cloudWatchUrlBase}${id}`)
                setRowData(response[currentImageIndex+1])
                setImg(id)
                updateBrowserURL(id)
                setOpen(true)
            }
        }
    }

    const handleClose = (rowData) => {
        let img = rowData.Key
        //To set the next image to original size
        setScale(1);
        const desiredPath = img.substring(0, img.lastIndexOf('/') + 1);
        updateBrowserURL(desiredPath)
        setOpen(false)
        setImg('')
    }

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
            if(error.includes('404')) {href('/404')}
        }
        // eslint-disable-next-line
    }, [resp])

    const useMyHref = (to) => {useHref(to)}
    const href = useMyHref

    //**********data table styling
    const ODD_OPACITY = 0.2


    const checkFormat = isImage(img) === 'jpeg' || isImage(img) === 'png' || isImage(img) === 'gif';
    const checkPdf = isImage(img) === 'pdf'


    useEffect(() => {
        if(sortedData && sortedData.length > 0){
            setResponse(sortedData);
        }
    }, [sortedData]);

    useEffect(() => {
        const handleResize = () => {
            setDivHeight(window.innerHeight - 450);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSortModelChange = (model) => {
        if(model[0]){
            const order = model[0].sort;
            let local = [...response]
           if (order === 'asc') {
               local.sort((a, b) => a['Key'].localeCompare(b['Key']));
               setSortOrder('asc')
            } else {
               setSortOrder('desc')
               local.sort((a, b) => a['Key'].localeCompare(b['Key'])).reverse();
           }
            setSortedData(local)
        }
    };

    const handleZoomIn = () => {
        const { current: transformComponent } = transformComponentRef;
        if (transformComponent) {
            setScale((prevScale) => prevScale + 0.1);
        }
    };

    const handleZoomOut = () => {
        const { current: transformComponent } = transformComponentRef;
        if (transformComponent) {
            setScale((prevScale) => prevScale / 1.1);
        }
    };

    const handleZoomReset = () => {
        const { current: transformComponent } = transformComponentRef;
        if (transformComponent) {
            const { resetTransform } = transformComponent;
            resetTransform();
            setScale(1);
        }
        //setScale(1);
    };

    const isExist = (targetItem) => {
        if(targetItem) return urls.some((item) => item.Key === targetItem.Key && item.Size === targetItem.Size);
    }

    useEffect(() => {
        const idArray = urls.map((row) => row.Key);
        setSelectionModel(idArray)
        dispatch(setSelectedList(urls))

    }, [urls]);

    const addFile = (row) => {
        if(!urls.includes(row)) setUrls([...urls, row])
        else {
            const newArray = urls.filter(item => item !== row);
            setUrls(newArray)
        }
    }

    const folderUrl = img.split('/').filter(Boolean);
    const folderName = folderUrl[folderUrl.length - 1];

    //**********jsx html**********
  return (
    <div style={{height:  `${divHeight}px`, width: '90%'}}>
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
            disableColumnMenu={true}
            rowsPerPageOptions={[10, 25, 50, 100]}
            checkboxSelection= {true}
            disableSelectionOnClick
            getRowId={row => row.Key}
            selectionModel={selectionModel}
            onSelectionModelChange={(id) => {
                // eslint-disable-next-line
                {/*handles the selction of rows*/}
                const selectedIDs = new Set(id)
                const selectedRowData = response.filter((row) => selectedIDs.has(row.Key))
                //setSelectionModel(array)
                setUrls(selectedRowData)
                dispatch(setSelectedList(selectedRowData))
            }}
            onRowClick={(row) => {handleCellDoubleClick(row);
           }
        }
            // onCellClick   onCellDoubleClick  onRowClick
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            onSortModelChange={handleSortModelChange}

        />
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            {checkFormat &&(
              <div style={{ height: "100%", width: "100%", "textAlign":"center" }}>
                    <span /*style={{ float: 'right' }}*/ className={'topRight'}>
                        <span className={!showArrowLeft? 'disabled-icon':''}> <FaArrowLeft className={'printIcon cursorPtr leftRightArrow'} title={"prev"} size={32} onClick={()=> handleNavigationClick(rowData, 'left')}/></span>
                        <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() =>   printJS({printable: `${config.cloudWatchUrlBase}${img}`, type: isImage(img) !== 'pdf' ? 'image':'pdf'})}><FaPrint className="fa-download-print" size={32} title="Print" /></button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => downloadFile(`${config.cloudWatchUrlBase}${img}`)}><FaDownload className="fa-download-print" size={32} title="Download" /></button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => addFile(rowData)}  ><FaCheckCircle className={`fa-download-print ${isExist(rowData) ? 'checked' : 'unchecked'}`} size={32} title="Download"/>
                                </button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => FileDownloader(urls, false)}  ><BiCartDownload className="fa-download-print" size={32} title="Download All"
                                /></button>
                            </span>
                            <FaTimes onClick={() => handleClose(rowData)} title={'Close'} className={'printIcon downPrint'} size={36}/>
                         <span className={!showArrowRight? 'disabled-icon':''}><FaArrowRight className={'printIcon cursorPtr leftRightArrow'} title={"next"} size={32} onClick={()=> handleNavigationClick(rowData, 'right')}/></span>
                        </span>
                  <h2 className="file-name"> {`${config.cloudWatchUrlBase}${img}`.split('/').pop()}

                  </h2>

                    <div className="image-zoom">
                        <div className="image-container">
                            <TransformWrapper key={filePath} ref={transformComponentRef} options={{ limitToBounds: false , wheel: false, pinch: false }}>
                                <TransformComponent>
                                    <img key={filePath} src={filePath} alt={'Zoomable Image'+ filePath}  style={{ transform: `scale(${scale})` }} />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                        <div className={'container'}>
                            <div className="zoom-buttons">
                                <button className={'cursorPtr img-zoom-in-out'} onClick={handleZoomIn}><BiZoomIn size={40} /></button>
                                <button className={'cursorPtr img-zoom-in-out'} onClick={handleZoomOut}><BiZoomOut size={40} /></button>
                                <button className={'cursorPtr img-zoom-in-out'} onClick={handleZoomReset}><TbZoomReset size={40} /></button>
                            </div>
                        </div>
                    </div>
                </div>)
            }
            {
              !checkFormat && checkPdf && (<div style={{ "textAlign":"center" }}>
                    <span className={'topCenter'}><h2 className="file-name"> {`${config.cloudWatchUrlBase}${img}`.split('/').pop()}

                    </h2></span>
                  <span /*style={{ float: 'right' }}*/ className={'topRight'}>
                      <span className={!showArrowLeft? 'disabled-icon':''}><FaArrowLeft className={'printIcon cursorPtr leftRightArrow'} title={"prev"} size={32} onClick={()=> handleNavigationClick(rowData, 'left')}/></span>
                      <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() =>   printJS({printable: `${config.cloudWatchUrlBase}${img}`, type: isImage(img) !== 'pdf' ? 'image':'pdf'})}><FaPrint className="fa-download-print" size={32} title="Print" /></button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => downloadFile(`${config.cloudWatchUrlBase}${img}`)}><FaDownload className="fa-download-print" size={32} title="Download" /></button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => addFile(rowData)}  ><FaCheckCircle className={`fa-download-print ${isExist(rowData) ? 'checked' : 'unchecked'}`} size={32} title="Download"
                                /></button>
                            </span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => FileDownloader(urls, false)}  ><BiCartDownload className="fa-download-print" size={32} title="Download All"
                                /></button>
                            </span>
                            <FaTimes onClick={() => handleClose(rowData)} title={'Close'} className={'printIcon downPrint'} size={36}/>
                      <span className={!showArrowRight? 'disabled-icon':''}><FaArrowRight className={'printIcon cursorPtr leftRightArrow'} title={"next"} size={32} onClick={()=> handleNavigationClick(rowData, 'right')}/></span>
                        </span>
              </div>)
            }
            {
              !checkFormat && checkPdf && (<Worker workerUrl={workerSrc}> <div
                className="rpv-core__viewer"
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '80%',
                    width: '70%'
                }}
              >
                  <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#eeeeee',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        padding: '4px',
                    }}
                  >
                      <Toolbar>
                          {(props) => {
                              const {
                                  CurrentPageInput,
                                  EnterFullScreen,
                                  GoToNextPage,
                                  GoToPreviousPage,
                                  NumberOfPages,
                                  ShowSearchPopover,
                                  Zoom,
                                  ZoomIn,
                                  ZoomOut,
                              } = props;
                              return (
                                <>

                                    <div style={{ padding: '0px 2px' }}>
                                        <ShowSearchPopover />
                                    </div>
                                    <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                        <EnterFullScreen />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ZoomOut />
                                    </div>

                                    <div style={{ padding: '0px 2px' }}>
                                        <Zoom />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <ZoomIn />
                                    </div>
                                    <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                        <GoToPreviousPage />
                                    </div>
                                    <div style={{ padding: '0px 2px', width: '4rem' }}>
                                        <CurrentPageInput />
                                    </div>
                                    <div style={{ padding: '0px 2px', color: 'black' }}>
                                        / <NumberOfPages />
                                    </div>
                                    <div style={{ padding: '0px 2px' }}>
                                        <GoToNextPage />
                                    </div>

                                </>
                              );
                          }}
                      </Toolbar>
                  </div>
                  <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                  >
                      <Viewer
                        fileUrl={`${config.cloudWatchUrlBase}${img}`}
                        plugins={[toolbarPluginInstance]}
                        defaultScale={1.25}
                      />
                  </div>
              </div></Worker>)

            }
            {
                !checkFormat && isImage(img) === 'text'? <TextFileViewer
                    fileUrl={`${config.cloudWatchUrlBase}${img}`}
                    handleClose={handleClose}
                    downloader={FileDownloader(urls, false)}
                    urls={urls}
                    addFile={addFile}
                    isExist={isExist}
                    rowData={rowData}
                    handleNavigationClick={handleNavigationClick}
                    updateBrowserURL={updateBrowserURL}
                    setOpen={setOpen}
                    setImg={setImg}
                    img={img}
                    response={response}
                    setFilePath={setFilePath}
                    showArrowRight={showArrowRight}
                    showArrowLeft={showArrowLeft}/>:''
            }
            {
                !checkFormat && !checkPdf && isImage(img) !== 'text'?
                    <div style={{ "textAlign":"center" , top: "50%", left: "50%"}}>
                        <h2 className="file-name"> {`${config.cloudWatchUrlBase}${img}`.split('/').pop()}
                            <span /*style={{ float: 'right' }}*/>
                                <span className={'printIcon'}>
                                   {isImage(img)?
                                       <button className={'downPrint'} onClick={() => downloadFile(`${config.cloudWatchUrlBase}${img}`)}>
                                           <FaDownload className="fa-download-print" size={40} title="Download" />
                                       </button>: folderName? "Folder: "+folderName:""}
                                </span>
                            </span>

                        </h2>
                        <span /*style={{ float: 'right' }}*/ className={'topRight'}>
                            <span className={!showArrowLeft? 'disabled-icon':''}><FaArrowLeft className={'printIcon cursorPtr leftRightArrow'} title={"prev"} size={32} onClick={()=> handleNavigationClick(rowData, 'left')}/></span>
                            <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => addFile(rowData)}><FaCheckCircle className={`fa-download-print ${isExist(rowData) ? 'checked' : 'unchecked'}`} size={32} title="Download"
                                /></button>
                            </span>
                             <span className={'printIcon'}>
                                <button className={'downPrint'} onClick={() => FileDownloader(urls, false)}  ><BiCartDownload className="fa-download-print" size={32} title="Download All"
                                /></button>
                            </span>
                            <FaTimes onClick={() => handleClose(rowData)} title={'Close'} className={'printIcon downPrint'} size={36}/>
                            <span className={!showArrowRight? 'disabled-icon':''}><FaArrowRight className={'printIcon cursorPtr leftRightArrow'} title={"next"} size={32} onClick={()=> handleNavigationClick(rowData, 'right')}/></span>
                        </span>
                    </div>:""
            }
        </Backdrop>
    </div>
  )
}

//**********React component return**********
export default ResultsTable
