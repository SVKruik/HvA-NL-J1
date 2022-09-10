import { ReactNode } from 'react'

interface ContentProps {
    children: ReactNode | ReactNode[]
}

const Content = ({children}: ContentProps) => {
    return (
        <main className="content">
            {children}
        </main>
    )
}

export default Content;