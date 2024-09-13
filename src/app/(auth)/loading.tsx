import LoadingSVG from '@/assets/icons/loading'

export default function Loading() {
    return (
        <div className="flex items-center justify-center w-screen h-full min-h-[80vh] text-ui-fg-base">
            <div className='w-24 h-24 animate-spin text-white'>
                <LoadingSVG />
            </div>
        </div>
    )
}
