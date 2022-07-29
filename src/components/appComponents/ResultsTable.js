import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useGetGranSearchQuery } from '../../feature/api/apiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { XMLParser } from 'fast-xml-parser'
import { setSelectedList } from '../../feature/selectedListSlice'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'
import { setCrumb } from '../../feature/crumbSlice'

//**********variable and class delarations**********/
const parser = new XMLParser()

const granColumns = [
    //columbs layout for when granules are returned
    {
        field: 'name', 
        headerName: 'Name', 
        width: 450,
        valueGetter: (params) => 
            `${getFName(params.row.Key)}`
    },
    {field: 'Key', headerName: 'Key', width: 550},
    {field: 'LastModified', headerName: 'Last Modified', width: 130},
    {field: 'Size', headerName: 'Size', type: 'number', width: 90},
]


const fileColumns = [
    //columbs layout for when folders are returned
    {field: 'Prefix', headerName: 'Folder Name', width: 200},
]


//**********Functions**********
const getFName = (uri) => {
    //takes in a uri and return granule name
    if(uri === undefined){return 'Loading'}
    const temp = uri.split('/')
    return temp.pop()
}


//**********React component**********
const ResultsTable = ({ skip, setSkipTrue, setSkipFalse }) => {

    //**********State Variables**********
    const search = useSelector(state => state.search.value)
    const delim = useSelector(state => state.delim.value)
    const dispatch = useDispatch()
    const [response, setResponse] = useState([]) 


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
            setResponse(validateResponse(jResp))
            setSkipTrue()
       }
    }


    const validateResponse = (resp) => {
        //validates the response from the api
        if(typeof resp === 'undefined'){
            return []
        } else return resp
    }


    const handleCellDoubleClick  = (id) => {
        //handles double click of a columb and queries a file 
        //if the double clicked columb is a file
        if(id.slice(-1) === '/'){
            setSkipFalse()
            dispatch(setDelim(''))
            dispatch(setSearch(id))
            dispatch(setCrumb(id))
        }
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
            console.log(error)
        }
    }, [resp])


    //**********jsx html**********
  return (
    <div style={{height: 635, width: '90%'}}>
        <DataGrid
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
        />
    </div>
  )
}

//**********React component return**********
export default ResultsTable