
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';

ModuleRegistry.registerModules([AllCommunityModule])


export default function TableTest(){

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([]);

    useEffect(() => {
        const fetchData = async () =>{
            const response = await fetch('https://api.potterdb.com/v1/characters')
            const data  = await response.json();

            if(Array.isArray(data.data) && data.data.length > 0){
                const parsed = data.data.map(item => {
                    return {
                        id: item.id,
                        ...item.attributes
                    };
                });

                const first = parsed[0];

                const generatedCols = Object.keys(first).map(key => ({
                field: key,
                sortable: true,
                filter: true,
                resizable: true,
            }));
                
            setColDefs(generatedCols);
            setRowData(parsed);
          
        }
            
        
    };
    fetchData();



    })

     
return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: 500 }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
        />
    </div>
)
}