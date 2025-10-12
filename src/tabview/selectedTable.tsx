import { TabView, TabPanel } from 'primereact/tabview';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

export default function SelectedTabs({ selectedRows }){


function renderValue(value, level = 0) {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
        return (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px', marginLeft: `${level * 12}px` }}>
                <tbody>
                    {Object.entries(value).map(([key, val]) => (
                        <tr key={key}>
                            <td
                                style={{
                                    fontWeight: 'bold',
                                    padding: '4px 8px',
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: '#f9f9f9',
                                    width: '30%',
                                    verticalAlign: 'top'
                                }}
                            >
                                {key}
                            </td>
                            <td style={{ padding: '4px 8px', borderBottom: '1px solid #eee' }}>
                                {renderValue(val, level + 1)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return value.toString();
}


    const renderRowTable = (row) => {
        if(!row) return <p>No selected row</p>;
    
return (
    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <tbody>
            {Object.entries(row).map(([key, value]) => (
                <tr key={key}>
                    <td style={{
                        fontWeight: 'bold',
                                padding: '4px 8px',
                                borderBottom: '1px solid #eee',
                                width: '30%',
                                backgroundColor: '#f9f9f9'
                    }}>
                        {key}
                    </td>
                    <td style={{
                        padding: '4px 8px',
                        borderBottom: '1px solid #eee'
                    }}>
                        {renderValue(value)}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)
    }
    return (
        <div className="card" style={{ marginTop: '1rem', width: '500px'}}>
        <h3 style={{marginBottom: '0.5rem'}}>
            <TabView>
                <TabPanel header="TPG 1">
                {
                    renderRowTable(selectedRows[0])
                }
            </TabPanel>
            <TabPanel header="TPG 2">
                {
                    renderRowTable(selectedRows[1])
                }
            </TabPanel>
            <TabPanel header="TPG 3">
                {
                    renderRowTable(selectedRows[2])
                }
            </TabPanel>
            </TabView>
        </h3>
    </div>
    )
}