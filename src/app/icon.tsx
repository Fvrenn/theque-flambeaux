import { ImageResponse } from 'next/og'

// Configuration de l'icône (favicon)
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      // Style circulaire Princeton Orange (Flambeaux)
      <div
        style={{
          fontSize: 24,
          background: '#ed7112',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
          fontWeight: '900',
          fontFamily: 'sans-serif',
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    }
  )
}
