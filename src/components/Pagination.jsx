const PAGE_SIZE = 10

function Pagination({ items, page, setPage }) {
  const totalPages = Math.ceil(items.length / PAGE_SIZE)
  const hasMore = page < totalPages
  const hasLess = page > 1

  if (items.length <= PAGE_SIZE) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
      {hasMore && (
        <button className="secondary" type="button" onClick={() => setPage((p) => p + 1)}>
          แสดงเพิ่ม ({items.length - page * PAGE_SIZE} รายการที่เหลือ)
        </button>
      )}
      {hasLess && (
        <button className="secondary" type="button" onClick={() => setPage(1)}>
          ▲ แสดงน้อยลง
        </button>
      )}
    </div>
  )
}

export { PAGE_SIZE }
export default Pagination
