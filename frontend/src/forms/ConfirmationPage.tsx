import LogoHeader from './components/headers/LogoHeader'

interface ConfirmationPageProps {
   formName: string;
}

function ConfirmationPage({ formName }: ConfirmationPageProps) {
   return (
      <>
         <LogoHeader />
         <div className='form-completed-container'>
            <div className='completion-content'>
               <div className='check-icon'>
                  <svg
                     width='80'
                     height='80'
                     viewBox='0 0 80 80'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'
                  >
                     <circle cx='40' cy='40' r='40' fill='#31AB48' />
                     <path
                        d='M33 45.17L52.59 25.58L56.41 29.41L33 52.83L23.59 43.41L27.41 39.59L33 45.17Z'
                        fill='white'
                     />
                  </svg>
               </div>
               <h1 className='completion-title'>
                  {formName} completed
               </h1>
               <p className='completion-message'>
                  <i>Your response has been recorded. You may exit the page now.</i>
               </p>
            </div>
         </div>
      </>
   )
}

export default ConfirmationPage;