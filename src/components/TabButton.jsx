function TabButton({ active, children, setActiveTab, tab }) {
  return (
    <button
      className={`tab-btn ${active === tab ? 'active' : ''}`}
      type="button"
      onClick={() => setActiveTab(tab)}
    >
      {children}
    </button>
  )
}

export default TabButton
