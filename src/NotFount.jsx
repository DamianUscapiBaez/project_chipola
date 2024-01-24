export const NotFount = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <h1 style={{ fontSize: '6rem', color: '#d32f2f', margin: '0' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#333', margin: '10px 0' }}>
                ¡Oops! Parece que la página que estás buscando no existe.
            </p>
            <p>
                ¿Quieres volver a la{' '}
                <a href="/" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                    página principal
                </a>
                ?
            </p>
        </div>
    );
}