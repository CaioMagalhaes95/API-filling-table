import {FileUpload} from 'primereact/fileupload'
import { useUploadData } from '../components/components'

export default function InsertFile({ showToast }){
    const { setProcessedData } = useUploadData();

    const handleUpload = async (event) => {
        const files = event.files;
        

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("http://localhost:3000/api/processar", {
                method: "POST",
                body: formData,
            });

            if(!response.ok) throw new Error("Erro no processamento");
            const json = await response.json();
            setProcessedData(json);
            showToast("✅ Arquivos enviados e processados com sucesso!", "success");

        }
        catch (error){
            console.error(error);
            showToast("💥 Erro ao enviar ou processar os arquivos", "error");
        }
        
    }

    

    return (
       <div className="card mb-4">
        <FileUpload
        name="files[]"
        multiple
        customUpload
        uploadHandler={handleUpload}
        chooseLabel="Select"
        uploadLabel="Send"
        cancelLabel="Cancel"
        accept=".csv, .xls, .xlsx, .json, .pdf, .jpg"
        maxFileSize={5000000}
        emptyTemplate={<p className='m-0'>Drag and drop files</p>}
        
        />
        </div>
    )
}