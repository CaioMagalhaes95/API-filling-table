import { UploadProvider } from './components/components'
import TableTest from './table/table'
import InsertFile from './upload/fileupload'
import { Stack } from '@mui/material'


function App() {
  

  return (
    <>
    <UploadProvider>
      <Stack direction="row" spacing={2}>
        <InsertFile></InsertFile>
        <TableTest></TableTest>
      </Stack>
    
     </UploadProvider>
    </>
  )
}

export default App
