
import { AllCommunityModule, ModuleRegistry, RowSelectionModule, type RowSelectionOptions } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react';
import { InputText } from 'primereact/inputtext'
import { useEffect, useMemo, useState } from 'react';
import { Divider, Stack } from '@mui/material';
import { useUploadData } from '../components/components';
import { Button } from 'primereact/button';
import 'ag-grid-community/styles/ag-theme-material.css';
import SelectedTabs from '../tabview/selectedTable';
import HighwayTabs from '../tabview/highwayTable';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable"

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
    const { processedData } = useUploadData();
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

    async function loadImageAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Falha ao carregar imagem: ${response.status}`);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Erro ao ler imagem"));
        reader.onloadend = () => {
        if (!reader.result) return reject(new Error("Imagem não lida"));
        resolve(reader.result.toString());
        };
        reader.readAsDataURL(blob);
    });
    }

    const handleExportPDF = async () => {
                if (!processedData || (selectedRows.length === 0 && highway.length === 0)) {
            alert("Envie os arquivos e selecione linhas antes de exportar.");
            return;
        }

        const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;

        const today = new Date().toLocaleString("pt-BR");

        // 🖼️ Ford logo
        const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/512px-Ford_logo_flat.svg.png";
        const logoImg = await loadImageAsBase64(logoUrl);

        // ✅ Função para desenhar cabeçalho com logo e título
        const header = (title) => {
            // Logo alinhado à esquerda
            const logoHeight = 15;
            const logoWidth = 30;
            doc.addImage(logoImg, "PNG", margin, 10, logoWidth, logoHeight);

            // Título centralizado
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(title, pageWidth / 2, 18, { align: "center" });

            // Linha divisória
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.line(margin, 28, pageWidth - margin, 28);
        };

        // ✅ Função para rodapé com numeração de páginas
        const footer = () => {
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(
                `Página ${i} de ${pageCount}`,
                pageWidth - margin,
                doc.internal.pageSize.getHeight() - 10,
                { align: "right" }
            );
            }
        };

        // 📝 Primeira página — cabeçalho + data
        header("📄 Relatório Consolidado");
        doc.setFontSize(11);
        doc.text(`Gerado em: ${today}`, margin, 35);
        doc.setFontSize(10);

        // ⚡️ Helper para gerar tabelas bonitinhas
        const generateTable = (title, rows) => {
            if (!rows || rows.length === 0) return;

            doc.addPage();
            header(title);

            const keys = Object.keys(rows[0]);
            const body = rows.map((row) =>
            keys.map((k) =>
                typeof row[k] === "object" ? JSON.stringify(row[k]) : row[k]
            )
            );

            autoTable(doc, {
            startY: 40,
            head: [keys],
            body: body,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            });
        };

        // highway table
        if (highway.length > 0) {
            generateTable("Linhas com palavra-chave (Highway)", highway);
        }

        // other selected table
        if (selectedRows.length > 0) {
            generateTable("Linhas selecionadas (Outras)", selectedRows);
        }

        // 🧾 Dados do JSON processado
        if (processedData) {
            doc.addPage();
            header("Dados Processados do Upload");

            const jsonStr = JSON.stringify(processedData, null, 2);
            const splitText = doc.splitTextToSize(jsonStr, pageWidth - 2 * margin);
            doc.text(splitText, margin, 40);
        }

        // 📌 Rodapé em todas as páginas
        footer();

        // 📝 Salvar
        const filename = `relatorio_ford_${today.replace(/[/: ]/g, "_")}.pdf`;
        doc.save(filename);
        };


     
return (

    <div style={{ height: 500, width: '70%'}}>
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
        marginLeft={'10%'}
        >
        <SelectedTabs selectedRows={selectedRows}/>
        <HighwayTabs selectedRows={highway} keyword={keyword}/>
        
        </Stack>

        <div style={{textAlign: "center", marginTop: "2rem"}}>
            <Button 
            style={{width: '80%', marginBottom: '2%'}}
            label="Report C1"
            icon= "pi pi-file-pdf"
            className="p-buttom-danger"
            onClick={handleExportPDF}
            disabled={!processedData || (selectedRows.length === 0 && highway.length === 0)}
            />
        </div>
    </div>
)
}