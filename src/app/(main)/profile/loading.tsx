import {ImSpinner2} from 'react-icons/im'

export default function Loading() {
    return (
      <div className="flex flex-grow items-center justify-center w-full h-full">
        <ImSpinner2 className='animate-spin h-12 w-12'/>
      </div>
    );
  }
  