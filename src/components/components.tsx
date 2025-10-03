import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export const UploadProvider = ({children}) => {
    const [processedData, setProcessedData] = useState(null);

    return (
        <UploadContext.Provider value={{processedData, setProcessedData}}>
            {children}
        </UploadContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUploadData = () => useContext(UploadContext);