import LoadingSVG from '@/assets/icons/loading'

export default function LoadingTemplate() {
    return (
        <div className='w-screen h-screen flex justify-center items-center text-primary'>
            <LoadingSVG className='w-20 h-20 animate-spin' />
        </div>
    )
}
