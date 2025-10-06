import { UploadProvider } from './components/components'
import TableTest from './table/table'
import InsertFile from './upload/fileupload'
import { Stack } from '@mui/material'
import { Toast } from "primereact/toast";
import {useRef} from "react";

function App() {
  const toast = useRef<Toast | null>(null); 

  // Função que exibe mensagens do Toast
  const showToast = (message: string, type: "success" | "info" | "warn" | "error" = "info") => {
    (toast.current as Toast).show({
      severity: type,  // success | info | warn | error
      summary: type.toUpperCase(),
      detail: message,
      life: 4000,
    });
  };

  return (
    <>
    <UploadProvider>
      <Stack direction="row" spacing={2}>
        <Toast ref={toast}/>
        <InsertFile showToast={showToast}></InsertFile>
        <TableTest></TableTest>
      </Stack>
    
     </UploadProvider>
    </>
  )
}

export default App
