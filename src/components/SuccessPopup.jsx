function SuccessPopup({ message, onClose, open }) {
  return (
    <div className={`popup-backdrop ${open ? 'active' : ''}`} onClick={onClose}>
      <div className="popup-card" onClick={(event) => event.stopPropagation()}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
        <h3>บันทึกข้อมูลสำเร็จ</h3>
        <p>{message}</p>
        <button className="primary" type="button" onClick={onClose}>
          ตกลง
        </button>
      </div>
    </div>
  )
}

export default SuccessPopup
