export default async function exportToExcel(
  headers: any[],
  rows: any[],
  title: string
) {
  const XLSX = await import('xlsx')
  // @ts-ignore
  const { saveAs } = await import('file-saver')
  const data = [headers, ...rows]

  const wb = XLSX.utils.book_new()
  wb.Props = {
    Title: title,
    CreatedDate: new Date()
  }
  wb.SheetNames.push(title)

  wb.Sheets[title] = XLSX.utils.aoa_to_sheet<any>(data)

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

  function s2ab(s: any) {
    var buf = new ArrayBuffer(s.length) // convert s to arrayBuffer
    var view = new Uint8Array(buf) // create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff // convert to octet
    return buf
  }

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    title + '.xlsx'
  )
}
