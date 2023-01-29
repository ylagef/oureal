export const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full flex-col gap-2">
      <svg
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 100 50"
        enable-background="new 0 0 100 50"
        style={{
          fill: 'white',
          width: '7rem'
        }}
      >
        <circle stroke="none" cx="20" cy="25" r="8">
          <animate attributeName="cy" dur="1s" values="10;35;10" repeatCount="indefinite" begin="0.1" />
        </circle>
        <circle stroke="none" cx="50" cy="25" r="8">
          <animate attributeName="cy" dur="1s" values="10;35;10" repeatCount="indefinite" begin="0.2" />
        </circle>
        <circle stroke="none" cx="80" cy="25" r="8">
          <animate attributeName="cy" dur="1s" values="10;35;10" repeatCount="indefinite" begin="0.3" />
        </circle>
      </svg>

      <p className="text-lg opacity-70">Cargando...</p>
    </div>
  )
}
