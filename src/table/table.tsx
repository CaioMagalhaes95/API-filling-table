
import { AllCommunityModule, ModuleRegistry, RowSelectionModule, type RowSelectionOptions } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react';
import { InputText } from 'primereact/inputtext'
import { useEffect, useMemo, useState } from 'react';
import { Divider, Stack } from '@mui/material';

import 'ag-grid-community/styles/ag-theme-material.css';
import SelectedTabs from '../tabview/selectedTable';
import HighwayTabs from '../tabview/highwayTable';

ModuleRegistry.registerModules([
    AllCommunityModule,
    RowSelectionModule

])


export default function TableTest(){

    const [search, setSearch] = useState('')

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);
    const [highway, setHighway] = useState([]);
    const keyword = 'net'; // substituir por highway

    useEffect(() => {
        const fetchData = async () =>{
            const response = await fetch('https://jsonplaceholder.typicode.com/users')
            const data  = await response.json();

            if(Array.isArray(data) && data.length > 0){
                
                const first = data[0];

                const generatedCols = Object.keys(first).map(key => ({
                
                field: key,
                colId: key,
                key: key,
                sortable: true,
                filter: true,
                resizable: true,
            }));
                
            setColDefs(generatedCols);
            setRowData(data);
          
        }
            
        
    };
    fetchData();



    }, []);


   
    const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(() => {
        return {
            mode: "multiRow",
        };
    }, []);

     const containKeyword = (obj: any, keyword: any) => {
        const lowerKeyword = keyword.toLowerCase();

        const searchObj = (value: any) => {
            if (value === null || value === undefined) return false;
            if (typeof value === 'object'){
                return Object.values(value).some(searchObj);
            }
            return value.toString().toLowerCase().includes(lowerKeyword);
        };
        return searchObj(obj);
    }


    const onSelectionChanged = (event: any) => {
        const selected = event.api.getSelectedRows();

        if(selected.length > 6) {
            const lastSelected = selected[selected.length - 1];
            event.api.deselectNode(event.api.getRowNode(lastSelected.id));
            return;
        }

        const highway: never[] = [];
        const noHighway: never[] = [];

        selected.forEach((row: never) => {
            if(containKeyword(row, keyword)){
                highway.push(row);
            } else {
                noHighway.push(row);
            }
            
        });

        setHighway(highway.slice(0,3));
        setSelectedRows(noHighway.slice(0, 3));
    }

     
return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: 500 }}>
        <div className="flex flex-column gap-2">
                
                <InputText id="username" 
                className="mb-3 p-2 border rounded w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{width: 400, margin: '5px', borderRadius: '8px', border: 'solid 0.3px #ccc', boxShadow: 'unset', height: '30px'}}
                />
                
        </div>

        <AgGridReact className="ag-theme-quartz"

            rowData={rowData}
            columnDefs={colDefs}
            quickFilterText={search}
            rowSelection={rowSelection}
            onSelectionChanged={onSelectionChanged}
            sideBar={true}
            
            
        />

        <Stack  direction="row" spacing={2}   
        divider={<Divider orientation="vertical" flexItem />}
        marginTop={'1rem'}
        marginLeft={'40%'}
        >
        <SelectedTabs selectedRows={selectedRows}/>
        <HighwayTabs selectedRows={highway} keyword={keyword}/>
        
        </Stack>
    </div>
)
}