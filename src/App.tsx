import { UploadProvider } from './components/components'
import TableTest from './table/table'
import InsertFile from './upload/fileupload'
import { Stack } from '@mui/material'
import NavbarComponent from './navbar/navbar'


function App() {
  

  return (
    <>
    <NavbarComponent />
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
