function Field({ children, full = false, label, wide = false }) {
  return (
    <div className={`field${wide ? ' wide' : ''}${full ? ' full' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  )
}

export default Field
