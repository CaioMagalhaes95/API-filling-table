
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react';
import { InputText } from 'primereact/inputtext'
import { useEffect, useState } from 'react';

import 'ag-grid-community/styles/ag-theme-material.css';

ModuleRegistry.registerModules([AllCommunityModule])


export default function TableTest(){

    const [search, setSearch] = useState('')

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([]);

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



    }, [])

     
return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: 500 }}>
        <div className="flex flex-column gap-2">
                
                <InputText id="username" 
                
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
        />
    </div>
)
}