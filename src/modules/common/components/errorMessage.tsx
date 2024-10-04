import React from 'react'

export const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <p className='text-destructive mt-4 text-sm font-light'>
            {message}
        </p>
    )
}
