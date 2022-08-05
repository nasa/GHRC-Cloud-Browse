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
import { alpha, Backdrop, Box } from '@mui/material'
import config from '../../config'
import { useHref } from 'react-router-dom'

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


    const fileColumns = [
        //columbs layout for when folders are returned
        {field: 'Prefix', headerName: 'Folder Name', flex: 1},
    ]


    //**************Table Layout Functions*************** */
    const getFName = (uri) => {
        //takes in a uri and return granule name
        if(uri === undefined){return 'Loading'}
        if(uri.slice(-1) === '/'){
            if(uri === search) return'./'
            return `./${uri.split(search).pop()}`
        }
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


    const getFSize = (rawSize) => {
        if(rawSize === undefined){return ''}
        if(rawSize === 0){return '-'}
        const size = (rawSize/1024).toPrecision(4)
        return `${size} KB`
    }


    //**********State Functions**********
    const processResp = (resp) =>{
        //process the response from the api call into an array of objects
        //for use in the data grid
        const xml = resp
        const json = parser.parse(xml)
        if(delim === '/'){
            const jResp = json['ListBucketResult']['CommonPrefixes']
            setResponse(validateResponse(jResp))
            setSkipTrue()
        } else {
            const jResp = json['ListBucketResult']['Contents']
            const filtered = validateResponse(jResp)
            setResponse(filtered)
            setSkipTrue()
       }
    }


    const validateResponse = (resp) => {
        //validates the response from the api
        if(typeof resp === 'undefined'){
            return []
        } else {
            if(search === '' || search.slice(-1) !== '/') {
                return resp
            } else {
                return resp.filter(respFilter)
            }
        }
    }


    const respFilter = (gran) =>{
        if(gran['Key'].slice(-1) === '/') return true
        const gSplit = gran['Key'].split(search)
        const str  = gSplit[1]
        return !str.includes('/')
    }


    const handleCellDoubleClick  = (id) => {
        //handles double click of a columb and queries a file 
        //if the double clicked columb is a file
        if(id.slice(-1) === '/'){
            setSkipFalse()
            dispatch(setDelim(''))
            dispatch(setSearch(id))
            dispatch(setCrumb(id))
        } else if (isImage(id)){
            setImg(id)
            handleToggle()
        }
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
            columns={delim === '/'? fileColumns: granColumns}
            rowsPerPageOptions={[10, 25, 50, 100]}
            checkboxSelection= {delim === '/' ? false : true}
            getRowId={row => delim === '/'? row.Prefix: row.Key}
            onSelectionModelChange={(id) => {
                {/*handles the selction of rows*/}
                const selectedIDs = new Set(id)
                const selectedRowData = response.filter((row) =>
                selectedIDs.has(delim === '/'? row.Prefix: row.Key))
                dispatch(setSelectedList(selectedRowData))
            }}
            onCellDoubleClick={(row) => {handleCellDoubleClick(row['id'])}} 
            getRowClassName={(params) => 
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
        />
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
        >
            <Box component='img'
                src={!isImage(img) ? '' :`${config.cloudWatchUrlBase}${img}`} 
                />
        </Backdrop>
</div>
  )
}

//**********React component return**********
export default ResultsTable