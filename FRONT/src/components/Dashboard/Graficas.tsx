const Graficas = () => {
  return (

    <div className="card shadow-lg h-100">
      <div className="card-body p-0 h-100">
        <iframe
          title="Power BI Dashboard"
          src="https://app.powerbi.com/view?r=eyJrIjoiMzBkNGExOTAtNDNhYS00Y2VmLWJhMjMtNjVkYWE2MjRlZGU3IiwidCI6IjUzYzBiMjUyLTFhZDEtNGI2MC1hZDU1LTIzMGM4MTM3MDEwZiJ9&pageName=3721d9830b6136039751"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}

export default Graficas;