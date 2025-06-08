export function formattedQuery(sql: string, params: any[] = []): string {
  let i = 0
  return sql.replace(/\?/g, () => {
    if (i >= params.length) return '?'
    const param = params[i++]
    if (param === null || param === undefined) return 'NULL'
    if (typeof param === 'string') return `'${param.replace(/'/g, "''")}'`
    if (typeof param === 'boolean') return param ? '1' : '0'
    if (param instanceof Date) return `'${param.toISOString()}'`
    return String(param)
  })
}
