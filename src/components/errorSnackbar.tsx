import { Snackbar, SnackbarContent } from '@mui/material'
import React from 'react'

interface ErrorSnackbarProps {
    errorMessage: string,
    open: boolean
    onClose: () => void
}

export default function ErrorSnackbar(props: ErrorSnackbarProps) {
    return <Snackbar
        autoHideDuration={6000}
        open={props.open}
        onClose={props.onClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
    >
        <SnackbarContent 
            style={{backgroundColor: 'red'}} 
            message={<span id="client-snackbar">{props.errorMessage}</span>}
        />
    </Snackbar>
}