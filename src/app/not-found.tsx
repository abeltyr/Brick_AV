import { Button } from '@/modules/ui/button'
import { Separator } from '@/modules/ui/separator'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='h-screen max-h-[900px] w-screen flex justify-center pt-16'>
      <div className='screen-padding flex flex-col'>
        <h1 className='text-5xl font-bold text-neutral-900 mb-6 '>404</h1>
        <p className='text-lg text-neutral-700 mb-8 max-w-[257px]'>Oops, the page your looking for does not exist.</p>

        <Separator />
        <p className='text-lg text-neutral-700 mt-8 max-w-[257px]'>You may want to head back to the homepage.</p>

        <Link href="/">
          <Button className='text-lg font-medium text-neutral-900 mt-6 py-[10px] px-6'>
            Go To Homepage
          </Button>
        </Link>

      </div>
    </div>
  )
}