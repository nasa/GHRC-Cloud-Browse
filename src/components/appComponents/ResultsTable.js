import { DataGrid } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { useGetGranSearchQuery } from '../../feature/api/apiSlice'
import { useSelector } from 'react-redux'
import { XMLParser } from 'fast-xml-parser'

//**********variable and class delarations**********/
const parser = new XMLParser()

const granColumns = [
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
    {field: 'Prefix', headerName: 'Folder Name', width: 200},
]


//**********Functions**********
const getFName = (uri) => {
    const temp = uri.split('/')
    return temp.pop()
}


//**********React component**********
const ResultsTable = () => {
    //**********State Variables**********
    const search = useSelector(state => state.search.value)
    const delim = useSelector(state => state.delim.value)
    const [response, setResponse] = useState([]) 
    const [skip, setSkip] = useState(false)


    //**********State Functions**********
    const processResp = (resp) =>{
        const xml = resp
        const json = parser.parse(xml)
        if(delim === '/'){
            setResponse(json['ListBucketResult']['CommonPrefixes'])
            setSkip(true)
        } else {
            setResponse(json['ListBucketResult']['Contents'])
            setSkip(true)
       }
        console.log(response)
    }


    //**********Api Logic**********
    const {
        data: resp,
        isSuccess,
        isError,
        error
    } = useGetGranSearchQuery({search, delim},
        {refetchOnMountOrArgChange: true,
        skip,})

    if(isSuccess){
        processResp(resp)
    } else if(isError){
        console.log(error)
    }


    //**********jsx html**********
  return (
    <div style={{height: 635, width: '90%'}}>
        <DataGrid
            rows={response}
            columns={delim === '/'? fileColumns: granColumns}
            rowsPerPageOptions={[10, 25, 50, 100]}
            checkboxSelection
            getRowId={row => delim === '/'? row.Prefix: row.Key}
        />
    </div>
  )
}

//**********React component return**********
export default ResultsTable