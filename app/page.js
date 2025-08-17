export default function Home() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#0070f3',
        marginBottom: '1rem'
      }}>
        NailArt Genius
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '2rem'
      }}>
        AI-powered nail art design platform
      </p>
      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f8ff',
        border: '2px solid #0070f3',
        borderRadius: '8px',
        display: 'inline-block'
      }}>
        <p style={{
          margin: 0,
          color: '#0070f3',
          fontWeight: 'bold'
        }}>
          Build Successful!
        </p>
      </div>
    </div>
  )
}
