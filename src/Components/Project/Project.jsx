import React, { useState } from 'react';
import { createData, readData, updateData, deleteData } from '../../service/Firebase_Service';

const CrudComponent = () => {
    const [id, setId] = useState('');
    const [data, setData] = useState('');
    const [fetchedData, setFetchedData] = useState('');

    const handleCreate = () => {
        createData(id, { content: data });
        alert('Data created!');
    };

    const handleRead = async () => {
        const data = await readData(id);
        setFetchedData(data ? JSON.stringify(data) : 'No data found');
    };

    const handleUpdate = () => {
        updateData(id, { content: data });
        alert('Data updated!');
    };

    const handleDelete = () => {
        deleteData(id);
        alert('Data deleted!');
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            gap: '10px'
        },
        input: {
            width: '300px',
            padding: '10px',
            fontSize: '16px'
        },
        button: {
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
        },
        dataDisplay: {
            marginTop: '20px',
            fontSize: '18px',
            color: 'darkblue'
        }
    };

    return (
        <div style={styles.container}>
            <input
                style={styles.input}
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="ID"
            />
            <input
                style={styles.input}
                type="text"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Data"
            />
            <button style={styles.button} onClick={handleCreate}>Create</button>
            <button style={styles.button} onClick={handleRead}>Read</button>
            <button style={styles.button} onClick={handleUpdate}>Update</button>
            <button style={styles.button} onClick={handleDelete}>Delete</button>
            {fetchedData && <p style={styles.dataDisplay}>{fetchedData}</p>}
        </div>
    );
};

export default CrudComponent;
