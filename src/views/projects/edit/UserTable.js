/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useState } from 'react';
import Switch from '@mui/material/Switch';
import { TextField } from '@mui/material';

const UserTable = ({ selectedUsers, managerAssignments, setManagerAssignments }) => {


    const apiRef = useGridApiRef();


    const handleEditCellChange = (meta) => {
        let updatedRow = apiRef.current.getRowWithUpdatedValues(meta.id, meta.field)
        setManagerAssignments(managerAssignments?.map(item => item.email === meta.id ? updatedRow : item))
        console.log(meta)
    }

    const handleCheckChange = (e, email) => {
        let ismanager = e.target.checked
        console.log(ismanager, email)
        setManagerAssignments(managerAssignments?.map(item => item.email === email ? { ...item, projectRoleId: ismanager ? 3 : 4 } : item))
    }

    useEffect(() => {
        setManagerAssignments(selectedUsers ?? [])
    }, [selectedUsers])

    const columns = [
        { field: 'userName', headerName: 'Name', width: 500 },
        {
            field: 'allocatedProjectCost', headerName: 'Cost', width: 200, editable: true,
            type: "number",
            align: 'left',
            headerAlign: "left"
        },
        {
            field: 'projectRoleId',
            headerName: 'Assign as Project Manager',
            width: 400,
            renderCell: (params) => (
                <Switch
                    checked={params.value === 3}
                    onChange={(e) => handleCheckChange(e, params.row.email)}

                // checked={managerAssignments[params.row.id]}
                // onChange={() =>
                //     setManagerAssignments((prevAssignments) => ({
                //         ...prevAssignments,
                //         [params.row.id]: !prevAssignments[params.row.id],
                //     }))
                // }
                />
            ),
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={managerAssignments}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row?.email}
                apiRef={apiRef}

                // cellEditStart={handleCellEditCommit}
                // onCellEditStart={handleEditCellChange}
                onCellEditStop={handleEditCellChange}

            // checkboxSelection
            />
        </div>
    );
};

export default UserTable;
