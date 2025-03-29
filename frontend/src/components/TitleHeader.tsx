import styles from '../css-modules/TitleHeader.module.css'

interface TitleHeaderProps {
   title: string
   description?: string
}

function TitleHeader({ title, description }: TitleHeaderProps) {
   return (
      <div className={styles.titleHeader}>
         <p className={styles.title}>{title}</p>
         {description && <p className={styles.description}>{description}</p>}
      </div>
   )
}

export default TitleHeader
