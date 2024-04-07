interface PageChildren {
    children: React.ReactNode;
}

export default function Layout({ children }: PageChildren) {
    return <>
        <div className="flex items-center justify-center h-screen">
            {children}
        </div>
    </>
}