import React, { useEffect } from 'react'
import ResumeTemplate1 from './template_1/ResumeTemplate1'
import ResumeTemplate2 from './template_2/ResumeTemplate2'
import ResumeTemplate3 from './template_3/ResumeTemplate3'
import ResumeTemplate4 from './template_4/ResumeTemplate4'
import { useFormContext } from '@/lib/context/FormProvider'


const ResumeTemplateSelector = () => {

  const {formData , template} = useFormContext()

  useEffect(()=>{console.log(template)}, [])

  switch (template) {
    case 1:
      return <ResumeTemplate1 />;
    case 2:
      return <ResumeTemplate2 />;
    case 3:
      return <ResumeTemplate3 />;
    case 4:
      return <ResumeTemplate4 />;
    default:
      return <div>No template selected</div>; // Handle unexpected template values
  }
 
}

export default ResumeTemplateSelector