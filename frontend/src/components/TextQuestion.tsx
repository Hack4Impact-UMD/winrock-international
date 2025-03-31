import React, { useState, CSSProperties } from 'react'

interface TextQuestionProps {
   name: string
   id: string
   response: string
}

const TextQuestion: React.FC<TextQuestionProps> = ({ name, id, response }) => {
   const [userResponse, setUserResponse] = useState<string>(response)

   const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserResponse(event.target.value)
   }

   return (
      <div style={styles.container}>
         <label htmlFor={id} style={styles.label}>
            {name}
         </label>
         <textarea
            id={id}
            value={userResponse}
            placeholder='Enter text here'
            onChange={handleInputChange}
            style={styles.textarea}
         />
      </div>
   )
}

const styles: { [key: string]: CSSProperties } = {
   container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
      width: '100%',
      padding: '2rem 10rem',
   },
   label: {
      fontSize: '0.9rem',
      color: '#333',
   },
   textarea: {
      width: '100%',
      minHeight: '4rem',
      padding: '0.625rem',
      borderRadius: '0.25rem',
      border: '1px solid #C1C7CE',
      resize: 'vertical',
      fontSize: '0.9rem',
      fontFamily: 'inherit',
   },
}

export default TextQuestion
